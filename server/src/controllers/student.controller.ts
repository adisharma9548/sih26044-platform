import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/student.service';
import { sendSuccess } from '../utils/response';

const studentService = new StudentService();

// ===== Profile =====
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const profile = await studentService.getProfile(userId);
    res.status(200).json(sendSuccess(profile, 'Student profile fetched'));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const profile = await studentService.updateProfile(userId, req.body);
    res.status(200).json(sendSuccess(profile, 'Profile updated'));
  } catch (error) {
    next(error);
  }
};

// ===== Skills =====
export const addSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const profile = await studentService.addSkill(userId, req.body);
    res.status(201).json(sendSuccess(profile, 'Skill added'));
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string; // ✅ explicit cast
    const profile = await studentService.updateSkill(userId, id, req.body);
    res.status(200).json(sendSuccess(profile, 'Skill updated'));
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const profile = await studentService.deleteSkill(userId, id);
    res.status(200).json(sendSuccess(profile, 'Skill deleted'));
  } catch (error) {
    next(error);
  }
};

// ===== Education =====
export const addEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const profile = await studentService.addEducation(userId, req.body);
    res.status(201).json(sendSuccess(profile, 'Education added'));
  } catch (error) {
    next(error);
  }
};

export const updateEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const profile = await studentService.updateEducation(userId, id, req.body);
    res.status(200).json(sendSuccess(profile, 'Education updated'));
  } catch (error) {
    next(error);
  }
};

export const deleteEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const profile = await studentService.deleteEducation(userId, id);
    res.status(200).json(sendSuccess(profile, 'Education deleted'));
  } catch (error) {
    next(error);
  }
};

// ===== Projects =====
export const addProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const profile = await studentService.addProject(userId, req.body);
    res.status(201).json(sendSuccess(profile, 'Project added'));
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const profile = await studentService.updateProject(userId, id, req.body);
    res.status(200).json(sendSuccess(profile, 'Project updated'));
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const profile = await studentService.deleteProject(userId, id);
    res.status(200).json(sendSuccess(profile, 'Project deleted'));
  } catch (error) {
    next(error);
  }
};

// ===== Certifications =====
export const addCertification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const profile = await studentService.addCertification(userId, req.body);
    res.status(201).json(sendSuccess(profile, 'Certification added'));
  } catch (error) {
    next(error);
  }
};

export const updateCertification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const profile = await studentService.updateCertification(userId, id, req.body);
    res.status(200).json(sendSuccess(profile, 'Certification updated'));
  } catch (error) {
    next(error);
  }
};

export const deleteCertification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const profile = await studentService.deleteCertification(userId, id);
    res.status(200).json(sendSuccess(profile, 'Certification deleted'));
  } catch (error) {
    next(error);
  }
};