import { Application } from 'express';
import { userRoutes } from './routes/userRoutes';
import { authMiddleware } from './helpers/auth-middleware';
import { authRoutes } from './routes/authRoutes';
import { bookCommentRoutes } from './routes/bookCommentRoutes';
import { bookRoutes } from './routes/bookRoutes';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
    const routes = () => {
        app.use(BASE_PATH, authRoutes.routes());

        app.use(BASE_PATH, authMiddleware.verifyUser, bookRoutes.routes());
        app.use(BASE_PATH, authMiddleware.verifyUser, bookCommentRoutes.routes());
        app.use(BASE_PATH, authMiddleware.verifyUser, userRoutes.routes());
    };
    routes();
};
