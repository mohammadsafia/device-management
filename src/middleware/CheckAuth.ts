
import { HttpError } from './';
import { NextFunction, Request, Response } from 'express';
import * as jwt from "jsonwebtoken";
import config from '../config/config';
export const CheckAuth = (request: Request | any, response: Response, next: NextFunction) => {
  if (request.method === "OPTIONS") {
    return next();
  }
  try {
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken: any = jwt.verify(token, config.server.jwt);
    request.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 401);
    throw next(error);
  }
};