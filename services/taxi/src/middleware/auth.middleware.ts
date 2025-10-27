import { NextFunction, Request, Response } from 'express';

// Simple auth middleware for testing
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // For now, just pass through - in production this would validate JWT tokens
  next();
};
