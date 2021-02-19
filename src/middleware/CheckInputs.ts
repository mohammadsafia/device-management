
import { NextFunction, Request, Response } from 'express';

import { InternalError } from './../utils';
import { inputSchema } from '../schema'
import { InputSchema } from '../interfaces';
export const CheckInputs = (input: InputSchema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    let schema = { ...inputSchema }
    let result = schema[input].validate(request.body)
    if (result?.error) {
      throw InternalError(next, result.error.message, 422);
    } else {
      next();
    }
  }
};