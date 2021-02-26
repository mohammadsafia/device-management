
import { NextFunction, Response, Request } from 'express';
import * as jwt from "jsonwebtoken";
import config from '../config/config';
import { UserRoles } from '../interfaces';
import { InternalError } from './../utils';
export const CheckRole = (roles: UserRoles[]) => {
  return (request: Request, res: Response, next: NextFunction) => {
    if (request.method === "OPTIONS") {
      return next();
    }
    try {
      const token = request.headers.authorization?.split(" ")[1];
      if (!token) {
        throw InternalError(next, "Authentication failed!", 401)
      }


      const decodedToken: any = jwt.verify(token, config.server.jwt);


      let access = false;
      for (let role of roles) {
        if (decodedToken.Roles.includes(role)) {
          access = true;
        }
      }

      if (access) {
        next();
      } else {
        throw InternalError(next, "You don't have permission", 403)
      }

    } catch (err) {
      throw InternalError(next, "Authentication failed!", 401)
    }
  }
}