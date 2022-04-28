import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

declare global {
    namespace Express {
        interface Request {
            currentUser?: AuthPayload;
        }
    }
}

export interface AuthPayload {
    userId: string;
    email: string;
    fullname: string;
    iat?: number;
}

export interface IUserDocument extends Document {
    _id?: string | ObjectId;
    fullname?: string,
    email?: string,
    password?: string,
    city: string,
    phoneNumber: string,
    favoriteBooks?: any[],
    createdAt: Date;

    comparePassword(password: string): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
}
