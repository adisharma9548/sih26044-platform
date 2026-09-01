import { Student } from '../models/Student';
import { Internship } from '../models/Internship';
import { ApiError } from '../middlewares/errorHandler';

export class MatchingService {
  async getMatchScore(studentId: string, internshipId: string) {
    const student = await Student.findOne({ user: studentId });
    const internship = await Internship.findById(internshipId).populate('skills.skillId');
    
    if (!student) throw new ApiError(404, 'STUDENT_NOT_FOUND', 'Student not found');
    if (!internship) throw new ApiError(404, 'INTERNSHIP_NOT_FOUND', 'Internship not found');

    const studentSkills = student.skills.map(s => s.name.toLowerCase());
    
    // Type assertion: skillId is populated, so we can access .name
    const required = internship.skills
      .filter(s => s.required)
      .map(s => (s.skillId as any).name.toLowerCase());
      
    const preferred = internship.skills
      .filter(s => !s.required)
      .map(s => (s.skillId as any).name.toLowerCase());

    const matchedRequired = required.filter(s => studentSkills.includes(s));
    const missingRequired = required.filter(s => !studentSkills.includes(s));
    const matchedPreferred = preferred.filter(s => studentSkills.includes(s));
    const missingPreferred = preferred.filter(s => !studentSkills.includes(s));

    const totalRequired = required.length || 1;
    const score = (matchedRequired.length / totalRequired) * 100;

    return {
      internshipId: internship._id,
      matchScore: Math.round(score),
      matchedSkills: matchedRequired,
      missingSkills: missingRequired,
      partialSkills: [],
      details: {
        required: { matched: matchedRequired.length, total: required.length },
        preferred: { matched: matchedPreferred.length, total: preferred.length },
      },
    };
  }

  async getMatchesForStudent(studentId: string) {
    const student = await Student.findOne({ user: studentId });
    if (!student) throw new ApiError(404, 'STUDENT_NOT_FOUND', 'Student not found');
    
    const internships = await Internship.find({ status: 'published' }).populate('skills.skillId');
    const results = [];
    for (const intern of internships) {
      const score = await this.getMatchScore(studentId, intern._id.toString());
      results.push({ internship: intern, ...score });
    }
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }
}