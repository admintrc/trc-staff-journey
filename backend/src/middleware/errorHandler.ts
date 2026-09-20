import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
  details?: any;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[${status}] ${message}`, err.details);

  res.status(status).json({
    success: false,
    error: {
      status,
      message,
      ...(process.env.NODE_ENV === 'development' && { details: err.details }),
    },
  });
};
