import { NextFunction } from 'express';
import { UserRoles } from '../interfaces';
import { HttpError } from '../middleware';

export const InternalError = (next: NextFunction, message: string, code: number) => {
  const error = new HttpError(message, code);
  throw next(error)
}

export const IsAdminOrMaintainer = async (request: any, next: NextFunction, userRoles: UserRoles[]): Promise<void> => {
  const role = request?.userRole?.role;
  if (!userRoles.includes(role)) {
    throw InternalError(next, "You don't have permission", 403)
  }
}