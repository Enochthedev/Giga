import { Request } from 'express';
import multer from 'multer';
import { getConfig } from '../config';
import { AppError } from '../utils/error-utils';

const config = getConfig();

// File filter function
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allow all file types for now - validation will be done in the service layer
  cb(null, true);
};

// Multer configuration for memory storage
const storage = multer.memoryStorage();

// Base multer configuration
const baseMulterConfig: multer.Options = {
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize, // Default max file size
    files: config.upload.maxFiles, // Maximum number of files
    fieldSize: 1024 * 1024, // 1MB field size limit
    fieldNameSize: 100, // Field name size limit
    fields: 20, // Maximum number of non-file fields
  },
};

// Error handler for multer errors
const handleMulterError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    let message = 'File upload error';
    let code = 'UPLOAD_ERROR';

    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = `File too large. Maximum size is ${config.upload.maxFileSize / (1024 * 1024)}MB`;
        code = 'FILE_TOO_LARGE';
        break;
      case 'LIMIT_FILE_COUNT':
        message = `Too many files. Maximum is ${config.upload.maxFiles}`;
        code = 'TOO_MANY_FILES';
        break;
      case 'LIMIT_FIELD_KEY':
        message = 'Field name too long';
        code = 'FIELD_NAME_TOO_LONG';
        break;
      case 'LIMIT_FIELD_VALUE':
        message = 'Field value too long';
        code = 'FIELD_VALUE_TOO_LONG';
        break;
      case 'LIMIT_FIELD_COUNT':
        message = 'Too many fields';
        code = 'TOO_MANY_FIELDS';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected field';
        code = 'UNEXPECTED_FIELD';
        break;
      default:
        message = error.message;
    }

    return res.status(400).json({
      success: false,
      error: {
        code,
        message,
      },
    });
  }

  next(error);
};

// Single file upload middleware
export const singleFileUpload = (fieldName: string = 'file') => {
  const upload = multer(baseMulterConfig).single(fieldName);

  return (req: Request, res: any, next: any) => {
    upload(req, res, error => {
      if (error) {
        return handleMulterError(error, req, res, next);
      }
      next();
    });
  };
};

// Multiple files upload middleware
export const multipleFilesUpload = (
  fieldName: string = 'files',
  maxCount?: number
) => {
  const upload = multer(baseMulterConfig).array(fieldName, maxCount);

  return (req: Request, res: any, next: any) => {
    upload(req, res, error => {
      if (error) {
        return handleMulterError(error, req, res, next);
      }
      next();
    });
  };
};

// Profile photo specific middleware (with image-specific limits)
export const profilePhotoUpload = () => {
  const profileConfig: multer.Options = {
    ...baseMulterConfig,
    limits: {
      ...baseMulterConfig.limits,
      fileSize: 5 * 1024 * 1024, // 5MB for profile photos
    },
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      // Only allow image files for profile photos
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(
          new AppError(
            'Only image files are allowed for profile photos',
            'INVALID_FILE_TYPE',
            400
          )
        );
      }
    },
  };

  const upload = multer(profileConfig).single('file');

  return (req: Request, res: any, next: any) => {
    upload(req, res, error => {
      if (error) {
        return handleMulterError(error, req, res, next);
      }
      next();
    });
  };
};

// Product image specific middleware
export const productImageUpload = () => {
  const productConfig: multer.Options = {
    ...baseMulterConfig,
    limits: {
      ...baseMulterConfig.limits,
      fileSize: 10 * 1024 * 1024, // 10MB for product images
    },
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      // Only allow image files for product images
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(
          new AppError(
            'Only image files are allowed for product images',
            'INVALID_FILE_TYPE',
            400
          )
        );
      }
    },
  };

  const upload = multer(productConfig).single('file');

  return (req: Request, res: any, next: any) => {
    upload(req, res, error => {
      if (error) {
        return handleMulterError(error, req, res, next);
      }
      next();
    });
  };
};

// Property photo specific middleware
export const propertyPhotoUpload = () => {
  const propertyConfig: multer.Options = {
    ...baseMulterConfig,
    limits: {
      ...baseMulterConfig.limits,
      fileSize: 15 * 1024 * 1024, // 15MB for property photos
    },
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      // Only allow image files for property photos
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(
          new AppError(
            'Only image files are allowed for property photos',
            'INVALID_FILE_TYPE',
            400
          )
        );
      }
    },
  };

  const upload = multer(propertyConfig).single('file');

  return (req: Request, res: any, next: any) => {
    upload(req, res, error => {
      if (error) {
        return handleMulterError(error, req, res, next);
      }
      next();
    });
  };
};

// Vehicle photo specific middleware
export const vehiclePhotoUpload = () => {
  const vehicleConfig: multer.Options = {
    ...baseMulterConfig,
    limits: {
      ...baseMulterConfig.limits,
      fileSize: 10 * 1024 * 1024, // 10MB for vehicle photos
    },
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      // Only allow image files for vehicle photos
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(
          new AppError(
            'Only image files are allowed for vehicle photos',
            'INVALID_FILE_TYPE',
            400
          )
        );
      }
    },
  };

  const upload = multer(vehicleConfig).single('file');

  return (req: Request, res: any, next: any) => {
    upload(req, res, error => {
      if (error) {
        return handleMulterError(error, req, res, next);
      }
      next();
    });
  };
};

// Document upload specific middleware
export const documentUpload = () => {
  const documentConfig: multer.Options = {
    ...baseMulterConfig,
    limits: {
      ...baseMulterConfig.limits,
      fileSize: 25 * 1024 * 1024, // 25MB for documents
    },
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      // Allow common document types
      const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'text/csv',
      ];

      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new AppError('Invalid document type', 'INVALID_FILE_TYPE', 400));
      }
    },
  };

  const upload = multer(documentConfig).single('file');

  return (req: Request, res: any, next: any) => {
    upload(req, res, error => {
      if (error) {
        return handleMulterError(error, req, res, next);
      }
      next();
    });
  };
};

export { handleMulterError };
