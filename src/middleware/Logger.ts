import logging from "../config/logging";
import { Request, Response, NextFunction } from 'express';
import config from "../config/config";

export const Logger = (req: Request, res: Response, next: NextFunction) => {
  /** Log the req */
  logging.info(config.server.namespace, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

  /** Log the req */
  logging.info(config.server.namespace, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);


  res.on('finish', () => {
    /** Log the res */
    logging.info(config.server.namespace, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
  })
  next();
}