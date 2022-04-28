import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import HTTP_STATUS from 'http-status-codes';
import { AuthPayload } from '../interfaces/user.interface';

export class AuthMiddleware {
    public verifyUser(req: Request, res: Response, next: NextFunction): void {
        if (!req.session?.jwt) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Token is not available' });
            return;
        }

        try {
            const payload: AuthPayload = JWT.verify(req.session?.jwt, 'thisisatesttoken') as AuthPayload;
            req.currentUser = payload;
        } catch (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Token is invalid' });
            return;
        }
        next();
    }

    public checkAuthentication(req: Request, res: Response, next: NextFunction): void {
        if (!req.currentUser) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Authentication is required to access this route.' });
            return;
        }
        next();
    }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
