import multer from 'multer';
import { ApiError } from './errorHandler';

const allowedMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export const uploadDocument = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new ApiError(400, 'UNSUPPORTED_FILE_TYPE', 'Only PDF, DOC, and DOCX files are allowed'));
      return;
    }
    callback(null, true);
  },
});
