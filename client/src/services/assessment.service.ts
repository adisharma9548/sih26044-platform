import api from './api';

export interface AssessmentSummary {
  _id: string;
  title: string;
  skillName: string;
  description?: string;
  passingScore: number;
  questionCount: number;
  attempted: boolean;
  attempt?: { score: number; passed: boolean; createdAt: string };
}

export interface StudentAssessment {
  _id: string;
  title: string;
  skillName: string;
  description?: string;
  passingScore: number;
  questions: { _id: string; question: string; options: string[] }[];
}

export interface AssessmentAttempt {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  passed: boolean;
  skillLevelAwarded?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface AssessmentQuestionInput { question: string; options: string[]; correctOptionIndex: number; }
export interface CreateAssessmentInput { title: string; skillName: string; description?: string; passingScore: number; questions: AssessmentQuestionInput[]; }

export const assessmentService = {
  list: async (): Promise<AssessmentSummary[]> => (await api.get('/assessments')).data.data,
  get: async (id: string): Promise<StudentAssessment> => (await api.get(`/assessments/${id}`)).data.data,
  submit: async (id: string, answers: number[]): Promise<AssessmentAttempt> => (await api.post(`/assessments/${id}/attempts`, { answers })).data.data,
  create: async (input: CreateAssessmentInput) => (await api.post('/assessments', input)).data.data,
  listMine: async (): Promise<(Omit<AssessmentSummary, 'attempted' | 'attempt'>)[]> => (await api.get('/assessments/manage/mine')).data.data,
};
