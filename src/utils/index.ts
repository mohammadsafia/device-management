import { NextFunction } from 'express';
import { HttpError } from '../middleware';

export const InternalError = (next: NextFunction, message: string, code: number) => {
  const error = new HttpError(message, code);
  throw next(error)
}