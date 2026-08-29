import api from './api';

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
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  resumeUrl?: string;
  portfolioUrl?: string;
}

export const studentService = {
  // Get profile
  getProfile: async (): Promise<StudentProfile> => {
    const response = await api.get('/students/profile');
    return response.data.data;
  },

  // Update basic info
  updateProfile: async (data: Partial<StudentProfile>): Promise<StudentProfile> => {
    const response = await api.put('/students/profile', data);
    return response.data.data;
  },

  // Add education
  addEducation: async (education: Omit<Education, '_id'>): Promise<StudentProfile> => {
    const response = await api.post('/students/education', education);
    return response.data.data;
  },

  // Update education
  updateEducation: async (educationId: string, education: Partial<Education>): Promise<StudentProfile> => {
    const response = await api.put(`/students/education/${educationId}`, education);
    return response.data.data;
  },

  // Delete education
  deleteEducation: async (educationId: string): Promise<StudentProfile> => {
    const response = await api.delete(`/students/education/${educationId}`);
    return response.data.data;
  },

  // Add project
  addProject: async (project: Omit<Project, '_id'>): Promise<StudentProfile> => {
    const response = await api.post('/students/projects', project);
    return response.data.data;
  },

  // Update project
  updateProject: async (projectId: string, project: Partial<Project>): Promise<StudentProfile> => {
    const response = await api.put(`/students/projects/${projectId}`, project);
    return response.data.data;
  },

  // Delete project
  deleteProject: async (projectId: string): Promise<StudentProfile> => {
    const response = await api.delete(`/students/projects/${projectId}`);
    return response.data.data;
  },

  // Add certification
  addCertification: async (cert: Omit<Certification, '_id'>): Promise<StudentProfile> => {
    const response = await api.post('/students/certifications', cert);
    return response.data.data;
  },

  // Update certification
  updateCertification: async (certId: string, cert: Partial<Certification>): Promise<StudentProfile> => {
    const response = await api.put(`/students/certifications/${certId}`, cert);
    return response.data.data;
  },

  // Delete certification
  deleteCertification: async (certId: string): Promise<StudentProfile> => {
    const response = await api.delete(`/students/certifications/${certId}`);
    return response.data.data;
  },
};