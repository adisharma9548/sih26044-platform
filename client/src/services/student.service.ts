import api from './api';

export interface Education {
  _id?: string;
  degree: string;
  institution: string;
  year: number;
  score?: string;
}

export interface Skill {
  _id?: string;
  name: string;
  category: 'Programming' | 'Design' | 'Data Science' | 'Cloud' | 'DevOps' | 'Soft Skills' | 'Other';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verified: boolean;
}

export type SkillInput = Pick<Skill, 'name' | 'category' | 'level'>;

export interface Project {
  _id?: string;
  title: string;
  description: string;
  link?: string;
}

export interface Certification {
  _id?: string;
  name: string;
  issuer: string;
  link?: string;
}

export interface FileMetadata {
  _id?: string;
  publicId: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export interface StudentProfile {
  _id: string;
  user: string;
  name: string;
  enrollmentNumber: string;
  department: string;
  year: number;
  targetRole: string;
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  resume?: FileMetadata;
  portfolioDocuments: FileMetadata[];
}

export interface CareerIntelligence {
  targetRole: string;
  readinessScore: number;
  profileCompletion: number;
  skillGaps: Array<{ name: string; current: number; required: number; gap: number; status: 'met' | 'gap' }>;
  biggestOpportunity: { name: string; current: number; required: number; gap: number } | null;
  roadmap: string[];
  generatedAt: string;
}

export const studentService = {
  // Profile
  getProfile: async (): Promise<StudentProfile> => {
    const response = await api.get('/students/profile');
    return response.data.data;
  },

  updateProfile: async (data: Partial<StudentProfile>): Promise<StudentProfile> => {
    const response = await api.put('/students/profile', data);
    return response.data.data;
  },

  // Education
  addEducation: async (education: Omit<Education, '_id'>): Promise<StudentProfile> => {
    const response = await api.post('/students/education', education);
    return response.data.data;
  },

  updateEducation: async (educationId: string, education: Partial<Education>): Promise<StudentProfile> => {
    const response = await api.put(`/students/education/${educationId}`, education);
    return response.data.data;
  },

  deleteEducation: async (educationId: string): Promise<StudentProfile> => {
    const response = await api.delete(`/students/education/${educationId}`);
    return response.data.data;
  },

  // Projects
  addProject: async (project: Omit<Project, '_id'>): Promise<StudentProfile> => {
    const response = await api.post('/students/projects', project);
    return response.data.data;
  },

  updateProject: async (projectId: string, project: Partial<Project>): Promise<StudentProfile> => {
    const response = await api.put(`/students/projects/${projectId}`, project);
    return response.data.data;
  },

  deleteProject: async (projectId: string): Promise<StudentProfile> => {
    const response = await api.delete(`/students/projects/${projectId}`);
    return response.data.data;
  },

  // Certifications
  addCertification: async (cert: Omit<Certification, '_id'>): Promise<StudentProfile> => {
    const response = await api.post('/students/certifications', cert);
    return response.data.data;
  },

  updateCertification: async (certId: string, cert: Partial<Certification>): Promise<StudentProfile> => {
    const response = await api.put(`/students/certifications/${certId}`, cert);
    return response.data.data;
  },

  deleteCertification: async (certId: string): Promise<StudentProfile> => {
    const response = await api.delete(`/students/certifications/${certId}`);
    return response.data.data;
  },

  // Skills
  addSkill: async (skill: SkillInput): Promise<StudentProfile> => {
    const response = await api.post('/students/skills', skill);
    return response.data.data;
  },

  updateSkill: async (skillId: string, skill: Partial<SkillInput>): Promise<StudentProfile> => {
    const response = await api.put(`/students/skills/${skillId}`, skill);
    return response.data.data;
  },

  deleteSkill: async (skillId: string): Promise<StudentProfile> => {
    const response = await api.delete(`/students/skills/${skillId}`);
    return response.data.data;
  },

  getCareerIntelligence: async (): Promise<CareerIntelligence> => {
    const response = await api.get('/students/career-intelligence');
    return response.data.data;
  },

  getCareerOptions: async (): Promise<string[]> => {
    const response = await api.get('/students/career-options');
    return response.data.data;
  },

  // Documents
  uploadResume: async (file: File): Promise<StudentProfile> => {
    const data = new FormData();
    data.append('document', file);
    const response = await api.post('/students/resume', data);
    return response.data.data;
  },

  deleteResume: async (): Promise<StudentProfile> => {
    const response = await api.delete('/students/resume');
    return response.data.data;
  },

  uploadPortfolioDocument: async (file: File): Promise<StudentProfile> => {
    const data = new FormData();
    data.append('document', file);
    const response = await api.post('/students/portfolio-documents', data);
    return response.data.data;
  },

  deletePortfolioDocument: async (documentId: string): Promise<StudentProfile> => {
    const response = await api.delete(`/students/portfolio-documents/${documentId}`);
    return response.data.data;
  },

  getDocumentDownloadUrl: async (type: 'resume' | 'portfolio', documentId?: string): Promise<string> => {
    const path = type === 'resume' ? '/students/documents/resume' : `/students/documents/portfolio/${documentId}`;
    const response = await api.get(path);
    return response.data.data.url;
  },
};
