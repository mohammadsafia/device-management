
import { HttpError } from './';
import { NextFunction, Request, Response } from 'express';
import * as jwt from "jsonwebtoken";
import config from '../config/config';
import { UserRoles } from '../interfaces';
export const CheckRole = (request: Request | any, response: Response, next: NextFunction) => {
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
    if (decodedToken.Role === UserRoles.Admin || decodedToken.Role === UserRoles.Maintainer) {
      next();
    } else {
      throw next(new HttpError("You don't have permission", 403));
    }

  } catch (err) {
    throw next(new HttpError("Authentication failed!", 401));
  }
};