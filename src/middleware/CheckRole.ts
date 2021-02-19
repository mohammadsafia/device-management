
import { HttpError } from './';
import { NextFunction, Response, Request } from 'express';
import * as jwt from "jsonwebtoken";
import config from '../config/config';
import { UserRoles } from '../interfaces';
export const CheckRole = (roles: UserRoles[]) => {
  return (request: Request | any, res: Response, next: NextFunction) => {
    if (request.method === "OPTIONS") {
      return next();
    }
    try {
      const token = request.headers.authorization?.split(" ")[1];
      if (!token) {
        throw next(new HttpError("Authentication failed!", 401));
      }
      const decodedToken: any = jwt.verify(token, config.server.jwt);
      request.userRole = { role: decodedToken.Role };
      if (roles.includes(decodedToken.Role)) {
        next();
      } else {
        throw next(new HttpError("You don't have permission", 403));
      }
    } catch (err) {
      throw next(new HttpError("Authentication failed!", 401));
    }
  }
}