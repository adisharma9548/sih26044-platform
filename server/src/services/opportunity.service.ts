import { Opportunity, IOpportunitySkill, OPPORTUNITY_TYPES, WORK_MODES } from '../models/Opportunity';
import { Recruiter } from '../models/Recruiter';
import { ApiError } from '../middlewares/errorHandler';

type OpportunityInput = { title: string; type: string; description: string; requiredSkills: unknown; preferredSkills?: unknown; location: string; workMode: string; duration?: string; stipend?: string; eligibility?: string; deadline: string; isPublished?: boolean; };

export class OpportunityService {
  async create(userId: string, input: OpportunityInput) {
    const recruiter = await this.recruiterForUser(userId);
    return Opportunity.create({ recruiter: recruiter._id, ...this.validate(input) });
  }

  async listForStudents(query: Record<string, unknown>) {
    const filter: Record<string, unknown> = { isPublished: true, deadline: { $gte: new Date() } };
    if (typeof query.type === 'string' && OPPORTUNITY_TYPES.includes(query.type as (typeof OPPORTUNITY_TYPES)[number])) filter.type = query.type;
    if (typeof query.workMode === 'string' && WORK_MODES.includes(query.workMode as (typeof WORK_MODES)[number])) filter.workMode = query.workMode;
    if (typeof query.location === 'string' && query.location.trim()) filter.location = new RegExp(this.escape(query.location.trim()), 'i');
    if (typeof query.skill === 'string' && query.skill.trim()) filter['requiredSkills.name'] = new RegExp(this.escape(query.skill.trim()), 'i');
    if (typeof query.search === 'string' && query.search.trim()) filter.$text = { $search: query.search.trim() };
    return Opportunity.find(filter).populate('recruiter', 'companyName industry location companyWebsite').sort({ createdAt: -1 }).lean();
  }

  async getForStudent(id: string) {
    const opportunity = await Opportunity.findOne({ _id: id, isPublished: true, deadline: { $gte: new Date() } }).populate('recruiter', 'companyName industry location companyWebsite').lean();
    if (!opportunity) throw new ApiError(404, 'OPPORTUNITY_NOT_FOUND', 'Opportunity not found');
    return opportunity;
  }

  async listMine(userId: string) {
    const recruiter = await this.recruiterForUser(userId);
    return Opportunity.find({ recruiter: recruiter._id }).sort({ createdAt: -1 }).lean();
  }

  async update(userId: string, id: string, input: OpportunityInput) {
    const recruiter = await this.recruiterForUser(userId);
    const opportunity = await Opportunity.findOneAndUpdate({ _id: id, recruiter: recruiter._id }, { $set: this.validate(input) }, { new: true, runValidators: true });
    if (!opportunity) throw new ApiError(404, 'OPPORTUNITY_NOT_FOUND', 'Opportunity not found');
    return opportunity;
  }

  async remove(userId: string, id: string) {
    const recruiter = await this.recruiterForUser(userId);
    const opportunity = await Opportunity.findOneAndDelete({ _id: id, recruiter: recruiter._id });
    if (!opportunity) throw new ApiError(404, 'OPPORTUNITY_NOT_FOUND', 'Opportunity not found');
  }

  private async recruiterForUser(userId: string) {
    const recruiter = await Recruiter.findOne({ user: userId });
    if (!recruiter) throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Recruiter profile not found');
    return recruiter;
  }

  private validate(input: OpportunityInput) {
    const title = input.title?.trim(); const description = input.description?.trim(); const location = input.location?.trim();
    const deadline = new Date(input.deadline);
    if (!title || !description || !location || !OPPORTUNITY_TYPES.includes(input.type as (typeof OPPORTUNITY_TYPES)[number]) || !WORK_MODES.includes(input.workMode as (typeof WORK_MODES)[number]) || Number.isNaN(deadline.getTime()) || deadline <= new Date()) throw new ApiError(400, 'INVALID_OPPORTUNITY', 'Provide valid opportunity details and a future deadline');
    return { title, type: input.type as 'internship' | 'job', description, requiredSkills: this.skills(input.requiredSkills, 'requiredSkills'), preferredSkills: this.skills(input.preferredSkills ?? [], 'preferredSkills'), location, workMode: input.workMode as 'onsite' | 'hybrid' | 'remote', duration: input.duration?.trim() || undefined, stipend: input.stipend?.trim() || undefined, eligibility: input.eligibility?.trim() || undefined, deadline, isPublished: input.isPublished ?? true };
  }

  private skills(value: unknown, field: string): IOpportunitySkill[] {
    if (!Array.isArray(value) || (field === 'requiredSkills' && value.length === 0) || value.length > 20) throw new ApiError(400, 'INVALID_SKILLS', 'Provide between 1 and 20 required skills');
    const seen = new Set<string>();
    return value.map((item) => {
      const skill = item as Partial<IOpportunitySkill>; const name = skill.name?.trim();
      if (!name || name.length > 80 || !['Beginner', 'Intermediate', 'Advanced'].includes(skill.level ?? '')) throw new ApiError(400, 'INVALID_SKILL', 'Each skill needs a name and valid level');
      const key = name.toLowerCase(); if (seen.has(key)) throw new ApiError(400, 'DUPLICATE_SKILL', 'Duplicate skills are not allowed'); seen.add(key);
      return { name, level: skill.level as IOpportunitySkill['level'] };
    });
  }

  private escape(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
}
