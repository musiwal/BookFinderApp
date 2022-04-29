import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import cors from 'cors';
import http from 'http';
import HTTP_STATUS from 'http-status-codes';
import cookieSession from 'cookie-session';
import 'express-async-errors';
import { CustomError, IErrorResponse } from './helpers/error-handler';
import applicationRoutes from './baseRoutes';

const SERVER_PORT = process.env.PORT || 5000;

export class BookServer {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public start(): void {
        this.middlewares(this.app);
        applicationRoutes(this.app);
        this.globalErrorHandler(this.app);
        this.startServer(this.app);
    }

    private middlewares(app: Application): void {
        app.set('trust proxy', 1);
        app.use(json({ limit: '50mb' }));
        app.use(urlencoded({ extended: true, limit: '50mb' }));
        app.use(
            cookieSession({
                name: 'session',
                keys: ['key1', 'key2'],
                sameSite: 'none',
                secure: true
            })
        );
        app.use(
            cors({
                origin: ['http://localhost:3000', 'https://mybook-finder.netlify.app'],
                credentials: true
            })
        );
    }

    private globalErrorHandler(app: Application): void {
        app.all('*', async (req: Request, res: Response) => {
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
        });

        app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json(error.serializeErrors());
            }
            next(error);
        });
    }

    private startServer(app: Application): void {
        try {
            const httpServer: http.Server = new http.Server(app);
            httpServer.listen(SERVER_PORT, () => {
                console.log(`Server running on port ${SERVER_PORT}`);
            });
        } catch (error) {
            console.log(error);
        }
    }
}