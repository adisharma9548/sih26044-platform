import api from './api';

export interface Skill {
  _id?: string;
  name: string;
  category: 'programming' | 'design' | 'data-science' | 'cloud' | 'devops' | 'soft-skills' | 'other';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verified: boolean;
}

export interface Education {
  _id?: string;
  degree: string;
  institution: string;
  year: number;
  score?: string;
}

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

export interface StudentProfile {
  _id: string;
  user: string;
  name: string;
  enrollmentNumber: string;
  department: string;
  year: number;
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  resumeUrl?: string;
  portfolioUrl?: string;
  careerReadiness?: number;
}

export const studentService = {
  getProfile: async (): Promise<StudentProfile> => {
    const res = await api.get('/students/profile');
    return res.data.data;
  },

  updateProfile: async (data: Partial<StudentProfile>): Promise<StudentProfile> => {
    const res = await api.put('/students/profile', data);
    return res.data.data;
  },

  addSkill: async (skill: Omit<Skill, '_id'>): Promise<StudentProfile> => {
    const res = await api.post('/students/skills', skill);
    return res.data.data;
  },

  updateSkill: async (id: string, data: Partial<Skill>): Promise<StudentProfile> => {
    const res = await api.put(`/students/skills/${id}`, data);
    return res.data.data;
  },

  deleteSkill: async (id: string): Promise<StudentProfile> => {
    const res = await api.delete(`/students/skills/${id}`);
    return res.data.data;
  },

  addEducation: async (edu: Omit<Education, '_id'>): Promise<StudentProfile> => {
    const res = await api.post('/students/education', edu);
    return res.data.data;
  },

  updateEducation: async (id: string, data: Partial<Education>): Promise<StudentProfile> => {
    const res = await api.put(`/students/education/${id}`, data);
    return res.data.data;
  },

  deleteEducation: async (id: string): Promise<StudentProfile> => {
    const res = await api.delete(`/students/education/${id}`);
    return res.data.data;
  },

  addProject: async (proj: Omit<Project, '_id'>): Promise<StudentProfile> => {
    const res = await api.post('/students/projects', proj);
    return res.data.data;
  },

  updateProject: async (id: string, data: Partial<Project>): Promise<StudentProfile> => {
    const res = await api.put(`/students/projects/${id}`, data);
    return res.data.data;
  },

  deleteProject: async (id: string): Promise<StudentProfile> => {
    const res = await api.delete(`/students/projects/${id}`);
    return res.data.data;
  },

  addCertification: async (cert: Omit<Certification, '_id'>): Promise<StudentProfile> => {
    const res = await api.post('/students/certifications', cert);
    return res.data.data;
  },

  updateCertification: async (id: string, data: Partial<Certification>): Promise<StudentProfile> => {
    const res = await api.put(`/students/certifications/${id}`, data);
    return res.data.data;
  },

  deleteCertification: async (id: string): Promise<StudentProfile> => {
    const res = await api.delete(`/students/certifications/${id}`);
    return res.data.data;
  },
};