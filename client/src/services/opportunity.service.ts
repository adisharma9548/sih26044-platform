import api from './api';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export interface OpportunitySkill { name: string; level: SkillLevel; }
export interface Opportunity { _id: string; title: string; type: 'internship' | 'job'; description: string; requiredSkills: OpportunitySkill[]; preferredSkills: OpportunitySkill[]; location: string; workMode: 'onsite' | 'hybrid' | 'remote'; duration?: string; stipend?: string; eligibility?: string; deadline: string; isPublished: boolean; recruiter?: { companyName: string; industry: string; location: string; companyWebsite?: string }; }
export interface OpportunityInput { title: string; type: 'internship' | 'job'; description: string; requiredSkills: OpportunitySkill[]; preferredSkills: OpportunitySkill[]; location: string; workMode: 'onsite' | 'hybrid' | 'remote'; duration?: string; stipend?: string; eligibility?: string; deadline: string; isPublished: boolean; }
export interface OpportunityFilters { search?: string; type?: string; workMode?: string; location?: string; skill?: string; }

export const opportunityService = {
  list: async (filters: OpportunityFilters): Promise<Opportunity[]> => (await api.get('/opportunities', { params: filters })).data.data,
  get: async (id: string): Promise<Opportunity> => (await api.get(`/opportunities/${id}`)).data.data,
  mine: async (): Promise<Opportunity[]> => (await api.get('/opportunities/mine')).data.data,
  create: async (input: OpportunityInput): Promise<Opportunity> => (await api.post('/opportunities', input)).data.data,
  update: async (id: string, input: OpportunityInput): Promise<Opportunity> => (await api.put(`/opportunities/${id}`, input)).data.data,
  remove: async (id: string): Promise<void> => { await api.delete(`/opportunities/${id}`); },
};
