import { Internship, IInternship } from '../models/Internship';
import { Skill } from '../models/Skill';
import { ApiError } from '../middlewares/errorHandler';

export class InternshipService {
  async create(data: Partial<IInternship>) {
    if (data.skills) {
      for (const skill of data.skills) {
        const exists = await Skill.findById(skill.skillId);
        if (!exists) throw new ApiError(400, 'INVALID_SKILL', `Skill ${skill.skillId} not found`);
      }
    }
    const internship = new Internship(data);
    await internship.save();
    return internship;
  }

  async getById(id: string) {
    const internship = await Internship.findById(id)
      .populate('company', 'companyName logoUrl')
      .populate('skills.skillId', 'name category');
    if (!internship) throw new ApiError(404, 'NOT_FOUND', 'Internship not found');
    return internship;
  }

  async list(filters: any = {}) {
    const query: any = { status: 'published' };
    if (filters.type) query.type = filters.type;
    if (filters.workMode) query.workMode = filters.workMode;
    if (filters.location) query.location = { $regex: filters.location, $options: 'i' };
    return Internship.find(query)
      .populate('company', 'companyName logoUrl')
      .populate('skills.skillId', 'name')
      .sort({ postedAt: -1 })
      .limit(50);
  }

  async update(id: string, data: Partial<IInternship>, userId: string) {
    const internship = await Internship.findById(id);
    if (!internship) throw new ApiError(404, 'NOT_FOUND', 'Internship not found');
    
    // Check ownership: populate company and then cast to any to access .user
    await internship.populate('company');
    const company = internship.company as any;
    if (company.user.toString() !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'Not authorized to edit this internship');
    }
    
    Object.assign(internship, data);
    await internship.save();
    return internship;
  }

  async delete(id: string, userId: string) {
    const internship = await Internship.findById(id);
    if (!internship) throw new ApiError(404, 'NOT_FOUND', 'Internship not found');
    
    await internship.populate('company');
    const company = internship.company as any;
    if (company.user.toString() !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'Not authorized to delete this internship');
    }
    
    await internship.deleteOne();
    return { success: true };
  }
}