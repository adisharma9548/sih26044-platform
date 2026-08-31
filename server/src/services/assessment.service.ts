import { Assessment, IAssessment, IAssessmentQuestion } from '../models/Assessment';
import { AssessmentAttempt, IAssessmentAttempt } from '../models/AssessmentAttempt';
import { Student, SkillLevel } from '../models/Student';
import { ApiError } from '../middlewares/errorHandler';

interface CreateAssessmentInput {
  title: string;
  skillName: string;
  description?: string;
  passingScore?: number;
  questions: IAssessmentQuestion[];
}

export class AssessmentService {
  async create(userId: string, input: CreateAssessmentInput): Promise<IAssessment> {
    const data = this.validateAssessmentInput(input);
    return Assessment.create({ ...data, createdBy: userId, isPublished: true });
  }

  async listForStudents(studentUserId: string) {
    const student = await Student.findOne({ user: studentUserId });
    if (!student) throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Student profile not found');

    const [assessments, attempts] = await Promise.all([
      Assessment.find({ isPublished: true }).select('title skillName description passingScore questions createdAt').sort({ createdAt: -1 }).lean(),
      AssessmentAttempt.find({ student: student._id }).select('assessment score passed createdAt').lean(),
    ]);
    const attemptByAssessment = new Map(attempts.map((attempt) => [String(attempt.assessment), attempt]));
    return assessments.map((assessment) => ({
      _id: assessment._id,
      title: assessment.title,
      skillName: assessment.skillName,
      description: assessment.description,
      passingScore: assessment.passingScore,
      questionCount: assessment.questions.length,
      attempted: attemptByAssessment.has(String(assessment._id)),
      attempt: attemptByAssessment.get(String(assessment._id)),
    }));
  }

  async getForStudent(assessmentId: string, studentUserId: string) {
    await this.getStudent(studentUserId);
    const assessment = await Assessment.findOne({ _id: assessmentId, isPublished: true }).lean();
    if (!assessment) throw new ApiError(404, 'ASSESSMENT_NOT_FOUND', 'Assessment not found');
    return {
      _id: assessment._id,
      title: assessment.title,
      skillName: assessment.skillName,
      description: assessment.description,
      passingScore: assessment.passingScore,
      questions: assessment.questions.map(({ _id, question, options }) => ({ _id, question, options })),
    };
  }

  async submit(assessmentId: string, studentUserId: string, answers: unknown): Promise<IAssessmentAttempt> {
    const student = await this.getStudent(studentUserId);
    const assessment = await Assessment.findOne({ _id: assessmentId, isPublished: true });
    if (!assessment) throw new ApiError(404, 'ASSESSMENT_NOT_FOUND', 'Assessment not found');
    if (await AssessmentAttempt.exists({ assessment: assessment._id, student: student._id })) {
      throw new ApiError(409, 'ASSESSMENT_ALREADY_ATTEMPTED', 'You have already attempted this assessment');
    }
    if (!Array.isArray(answers) || answers.length !== assessment.questions.length || answers.some((answer) => !Number.isInteger(answer))) {
      throw new ApiError(400, 'INVALID_ANSWERS', 'Answer every question using a valid option');
    }
    answers.forEach((answer, index) => {
      if (answer < 0 || answer >= assessment.questions[index].options.length) {
        throw new ApiError(400, 'INVALID_ANSWER_OPTION', 'One or more selected options are invalid');
      }
    });

    const correctAnswers = answers.filter((answer, index) => answer === assessment.questions[index].correctOptionIndex).length;
    const score = Math.round((correctAnswers / assessment.questions.length) * 100);
    const passed = score >= assessment.passingScore;
    const skillLevelAwarded = passed ? this.skillLevelForScore(score) : undefined;
    const attempt = await AssessmentAttempt.create({
      assessment: assessment._id,
      student: student._id,
      answers,
      score,
      correctAnswers,
      totalQuestions: assessment.questions.length,
      passed,
      skillLevelAwarded,
    });
    if (skillLevelAwarded) await this.raiseStudentSkill(student, assessment.skillName, skillLevelAwarded);
    return attempt;
  }

  async listCreatedBy(userId: string) {
    return Assessment.find({ createdBy: userId }).select('title skillName passingScore questions isPublished createdAt').sort({ createdAt: -1 }).lean()
      .then((assessments) => assessments.map(({ questions, ...assessment }) => ({ ...assessment, questionCount: questions.length })));
  }

  private async getStudent(userId: string) {
    const student = await Student.findOne({ user: userId });
    if (!student) throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Student profile not found');
    return student;
  }

  private validateAssessmentInput(input: CreateAssessmentInput) {
    const title = input.title?.trim();
    const skillName = input.skillName?.trim();
    const description = input.description?.trim();
    const passingScore = Number(input.passingScore ?? 60);
    if (!title || !skillName || !Number.isInteger(passingScore) || passingScore < 1 || passingScore > 100) {
      throw new ApiError(400, 'INVALID_ASSESSMENT', 'Provide a title, skill name, and passing score between 1 and 100');
    }
    if (!Array.isArray(input.questions) || input.questions.length < 1 || input.questions.length > 30) {
      throw new ApiError(400, 'INVALID_QUESTIONS', 'An assessment must have between 1 and 30 questions');
    }
    const questions = input.questions.map((item, index) => {
      const question = item.question?.trim();
      const options = Array.isArray(item.options) ? item.options.map((option) => option?.trim()) : [];
      if (!question || options.length < 2 || options.length > 6 || options.some((option) => !option) || !Number.isInteger(item.correctOptionIndex) || item.correctOptionIndex < 0 || item.correctOptionIndex >= options.length) {
        throw new ApiError(400, 'INVALID_QUESTION', `Question ${index + 1} needs 2–6 options and one valid correct answer`);
      }
      return { question, options, correctOptionIndex: item.correctOptionIndex };
    });
    return { title, skillName, description: description || undefined, passingScore, questions };
  }

  private skillLevelForScore(score: number): 'Beginner' | 'Intermediate' | 'Advanced' {
    if (score >= 85) return 'Advanced';
    if (score >= 70) return 'Intermediate';
    return 'Beginner';
  }

  private async raiseStudentSkill(student: Awaited<ReturnType<AssessmentService['getStudent']>>, skillName: string, level: SkillLevel) {
    const rank: Record<SkillLevel, number> = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };
    const existing = student.skills.find((skill) => skill.name.toLowerCase() === skillName.toLowerCase());
    if (existing) {
      if (rank[level] > rank[existing.level]) existing.level = level;
    } else {
      student.skills.push({ name: skillName, category: 'Other', level, verified: false });
    }
    await student.save();
  }
}
