import * as http from "http";
import bodyParser from 'body-parser';
import express, { Express } from 'express';
import mongoose from 'mongoose';

/**Swagger */
import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from '../swagger.json';


/** Config */
import logging from './config/logging';
import config from './config/config';

/**Routes */
import userRoutes from './routes/UserRoutes';
import authRoutes from './routes/AuthRoutes';
import deviceRoutes from './routes/DeviceRoutes';
import assignmentRoutes from './routes/AssignmentRoutes';
import maintenanceRoutes from './routes/MaintenanceRoutes';

/** Middleware */
import { Logger, AccessController, HttpError, CheckHttpError } from './middleware';


export class Server {
    private static instance: Server;
    private readonly _app: Express;

    get app(): Express {
        return this._app;
    }

    private _server!: http.Server;

    get server(): http.Server {
        return this._server;
    }

    public static getInstance = (): Server => {
        if (!Server.instance) Server.instance = new Server();

        return Server.instance;
    }

    private constructor() {
        this._app = express();

        this.connectWithDB();

        this.configureMiddleware();

        this.configureRoutes();

        this.configureErrorHandler();

        this._app.set("port", process.env.PORT || 3001);
    }

    private connectWithDB() {
        /** Connect to Mongo */
        mongoose
            .connect(config.mongo.url, config.mongo.options)
            .then((result) => {
                logging.info(config.server.namespace, 'Mongo Connected');
            })
            .catch((error) => {
                logging.error(config.server.namespace, error.message, error);
            });
    }

    private configureRoutes() {
        /** Routes go here */
        this._app.use('/api/auth', authRoutes);
        this._app.use('/api', userRoutes);
        this._app.use('/api', deviceRoutes);
        this._app.use('/api', assignmentRoutes);
        this._app.use('/api', maintenanceRoutes);
    }

    private configureMiddleware() {
        // Required for POST requests
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: true }));

        // CORS
        this.app.use(AccessController);

        /** Log the request */
        this._app.use(Logger);

        // /** Swagger */
        // this._app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    private configureErrorHandler() {
        /** Error handling */
        this._app.use(() => {
            const error = new HttpError("Could not find this route.", 404);
            throw error;
        });

        this._app.use(CheckHttpError);
    }

    public start() {
        this._server = this._app.listen(config.server.port, () =>
            logging.info(config.server.namespace, `Server is running ${config.server.hostname}:${config.server.port}`));
    }

}

const server = Server.getInstance();
server.start();