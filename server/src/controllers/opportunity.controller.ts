import { NextFunction, Request, Response } from 'express';
import { OpportunityService } from '../services/opportunity.service';
import { sendSuccess } from '../utils/response';

const opportunityService = new OpportunityService();

export class OpportunityController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> { try { res.status(200).json(sendSuccess(await opportunityService.listForStudents(req.query), 'Opportunities fetched successfully')); } catch (error) { next(error); } }
  async get(req: Request, res: Response, next: NextFunction): Promise<void> { try { res.status(200).json(sendSuccess(await opportunityService.getForStudent(req.params.id as string), 'Opportunity fetched successfully')); } catch (error) { next(error); } }
  async create(req: Request, res: Response, next: NextFunction): Promise<void> { try { res.status(201).json(sendSuccess(await opportunityService.create(req.user!.userId, req.body), 'Opportunity published successfully')); } catch (error) { next(error); } }
  async listMine(req: Request, res: Response, next: NextFunction): Promise<void> { try { res.status(200).json(sendSuccess(await opportunityService.listMine(req.user!.userId), 'Your opportunities fetched successfully')); } catch (error) { next(error); } }
  async update(req: Request, res: Response, next: NextFunction): Promise<void> { try { res.status(200).json(sendSuccess(await opportunityService.update(req.user!.userId, req.params.id as string, req.body), 'Opportunity updated successfully')); } catch (error) { next(error); } }
  async remove(req: Request, res: Response, next: NextFunction): Promise<void> { try { await opportunityService.remove(req.user!.userId, req.params.id as string); res.status(204).send(); } catch (error) { next(error); } }
}
