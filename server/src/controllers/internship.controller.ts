import { Request, Response, NextFunction } from 'express';
import { InternshipService } from '../services/internship.service';
import { MatchingService } from '../services/matching.service';
import { sendSuccess } from '../utils/response';

const internshipService = new InternshipService();
const matchingService = new MatchingService();

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Assuming the recruiter's user ID is attached to the request
    const data = { ...req.body, company: req.user!.userId };
    const internship = await internshipService.create(data);
    res.status(201).json(sendSuccess(internship, 'Internship created'));
  } catch (error) {
    next(error);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const internships = await internshipService.list(req.query);
    res.status(200).json(sendSuccess(internships, 'Internships fetched'));
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string; // ✅ explicit cast
    const internship = await internshipService.getById(id);
    res.status(200).json(sendSuccess(internship, 'Internship fetched'));
  } catch (error) {
    next(error);
  }
};

export const getMatches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const matches = await matchingService.getMatchesForStudent(userId);
    res.status(200).json(sendSuccess(matches, 'Matches computed'));
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string; // ✅ explicit cast
    const internship = await internshipService.update(id, req.body, userId);
    res.status(200).json(sendSuccess(internship, 'Internship updated'));
  } catch (error) {
    next(error);
  }
};

export const deleteInternship = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string; // ✅ explicit cast
    await internshipService.delete(id, userId);
    res.status(200).json(sendSuccess(null, 'Internship deleted'));
  } catch (error) {
    next(error);
  }
};