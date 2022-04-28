import { Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import HTTP_STATUS from 'http-status-codes';
import { ValidationError } from 'joi';

import { BadRequestError } from './../../helpers/error-handler';
import { IUserDocument } from '../../interfaces/user.interface';
import { UserModel } from '../../models/user.schema';
import { validateSignup, validateLogin } from './validate';

export class Auth {
    public async create(req: Request, res: Response): Promise<void> {
        const error: ValidationError = await validateSignup(req.body)  as ValidationError;
        if (error?.details) {
            throw new BadRequestError(error.details[0].message);
        }
        const { fullname, email, password, city, phoneNumber } = req.body;
        const checkIfUserExist: IUserDocument = (await UserModel.findOne({
            fullname: fullname,
            email: email
        }).exec()) as IUserDocument;
        if (checkIfUserExist) {
            throw new BadRequestError('Invalid credentials');
        }

        const data: IUserDocument = {
            fullname,
            email,
            city,
            password,
            phoneNumber
        } as IUserDocument;

        const result = await UserModel.create(data);
        const userJwt: string = Auth.prototype.signToken(result);
        req.session = { jwt: userJwt };
        res.status(HTTP_STATUS.CREATED).json({ message: 'User created succesffuly', user: data, token: userJwt });
    }

    public async read(req: Request, res: Response): Promise<void> {
        const error: ValidationError = await validateLogin(req.body) as ValidationError;
        if (error?.details) {
            throw error.details[0].message;
        }
        const { email, password } = req.body;
        const existingUser: IUserDocument = (await UserModel.findOne({
            email: email
        }).exec()) as IUserDocument;
        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }

        const passwordsMatch: boolean = await existingUser.comparePassword(password);
        if (!passwordsMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        const userJwt: string = Auth.prototype.signToken(existingUser);
        req.session = { jwt: userJwt };
        res.status(HTTP_STATUS.CREATED).json({
            message: 'User login successfully',
            user: existingUser,
            token: userJwt,
        });
    }

    public async update(req: Request, res: Response): Promise<void> {
        req.session = null;
        res.status(HTTP_STATUS.OK).json({ message: 'Logout successful', user: {}, token: '' });
    }

    private signToken(data: IUserDocument): string {
        return JWT.sign(
            {
                userId: data._id,
                email: data.email,
                fullname: data.fullname,
            },
            'thisisatesttoken'
        );
    }
}
