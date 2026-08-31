import { NextFunction, Request, Response } from 'express';
import { ApplicationService } from '../services/application.service';
import { sendSuccess } from '../utils/response';

const applicationService = new ApplicationService();

export class ApplicationController {
  async apply(req: Request, res: Response, next: NextFunction): Promise<void> { try { res.status(201).json(sendSuccess(await applicationService.apply(req.user!.userId, req.params.opportunityId as string, req.body.coverNote), 'Application submitted successfully')); } catch (error) { next(error); } }
  async listMine(req: Request, res: Response, next: NextFunction): Promise<void> { try { res.status(200).json(sendSuccess(await applicationService.listForStudent(req.user!.userId), 'Applications fetched successfully')); } catch (error) { next(error); } }
  async withdraw(req: Request, res: Response, next: NextFunction): Promise<void> { try { res.status(200).json(sendSuccess(await applicationService.withdraw(req.user!.userId, req.params.id as string), 'Application withdrawn successfully')); } catch (error) { next(error); } }
  async listForOpportunity(req: Request, res: Response, next: NextFunction): Promise<void> { try { res.status(200).json(sendSuccess(await applicationService.listForRecruiter(req.user!.userId, req.params.opportunityId as string), 'Applicants fetched successfully')); } catch (error) { next(error); } }
  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> { try { res.status(200).json(sendSuccess(await applicationService.updateStatus(req.user!.userId, req.params.id as string, req.body.status), 'Application status updated successfully')); } catch (error) { next(error); } }
}
