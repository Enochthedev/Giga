import { RequestHandler } from 'express';
import multer from 'multer';
import { getConfig } from '../config';

const config = getConfig();

/**
 * Multer configuration for file uploads
 */
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: config.validation.maxFileSize,
    files: 10, // Max 10 files per request
  },
  fileFilter: (req, file, cb) => {
    // Basic file type validation
    if (config.validation.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
  },
});

/**
 * Single file upload middleware
 */
export const singleUpload: RequestHandler = uploadMiddleware.single('file');

/**
 * Multiple file upload middleware
 */
export const multipleUpload: RequestHandler = uploadMiddleware.array(
  'files',
  10
);
