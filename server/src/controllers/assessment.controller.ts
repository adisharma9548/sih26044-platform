import { NextFunction, Request, Response } from 'express';
import { AssessmentService } from '../services/assessment.service';
import { sendSuccess } from '../utils/response';

const assessmentService = new AssessmentService();

export class AssessmentController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const assessment = await assessmentService.create(req.user!.userId, req.body);
      res.status(201).json(sendSuccess(assessment, 'Assessment created successfully'));
    } catch (error) { next(error); }
  }

  async listForStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const assessments = await assessmentService.listForStudents(req.user!.userId);
      res.status(200).json(sendSuccess(assessments, 'Assessments fetched successfully'));
    } catch (error) { next(error); }
  }

  async getForStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const assessment = await assessmentService.getForStudent(req.params.id as string, req.user!.userId);
      res.status(200).json(sendSuccess(assessment, 'Assessment fetched successfully'));
    } catch (error) { next(error); }
  }

  async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const attempt = await assessmentService.submit(req.params.id as string, req.user!.userId, req.body.answers);
      res.status(201).json(sendSuccess(attempt, 'Assessment submitted successfully'));
    } catch (error) { next(error); }
  }

  async listCreatedBy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const assessments = await assessmentService.listCreatedBy(req.user!.userId);
      res.status(200).json(sendSuccess(assessments, 'Created assessments fetched successfully'));
    } catch (error) { next(error); }
  }
}
