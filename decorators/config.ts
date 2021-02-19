import { Request, Response, NextFunction } from "express";
import { server } from "../src/server";

export enum METHOD {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}

interface RouteConfigProps {
  method: METHOD;
  path: string;
}

export function routeConfig({ method, path }: RouteConfigProps): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const response = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const original = await descriptor.value(req, res, next);

        res.status(200).json(original);
      } catch (e) {
        res.status(500).json({
          message: "Some error occurred",
          error: e.message,
          stack: e.stack,
        });
      }
    }

    server.app[method](path, response);
  }
}