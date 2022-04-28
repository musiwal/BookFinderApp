import { Request, Response } from 'express';
import mongoose, { LeanDocument } from 'mongoose';
import HTTP_STATUS from 'http-status-codes';

import { IUserDocument } from '../../interfaces/user.interface';
import { UserModel } from '../../models/user.schema';
import { BookModel } from '../../models/book.schema';

export class User {
    public async profile(req: Request, res: Response): Promise<void> {
        const existingUser: LeanDocument<IUserDocument> | null  = await UserModel.findOne({ _id: req.currentUser?.userId })
            .lean()
            .populate('favoriteBooks')
            .exec();
        res.status(HTTP_STATUS.OK).json({ message: 'User profile', user: existingUser });
    }

    public async addBookToFavorites(req: Request, res: Response): Promise<void> {
        const { bookId } = req.params;
        const bookRating = await UserModel.updateOne(
            { _id: req.currentUser!.userId },
            {
                $push: { favoriteBooks: new mongoose.Types.ObjectId(bookId) }
            }
        );
        await BookModel.updateOne({ _id: bookId }, { $push: { users: new mongoose.Types.ObjectId(req.currentUser!.userId) } });
        res.status(HTTP_STATUS.OK).json({ message: 'Book added to favorites', book: bookRating });
    }

    public async deleteFavorite(req: Request, res: Response): Promise<void> {
        const { bookId } = req.params;
        await UserModel.updateOne(
            { _id: req.currentUser?.userId }, 
            {
                $pull: { favoriteBooks: new mongoose.Types.ObjectId(bookId) }
            }
        );
        await BookModel.updateOne({ _id: bookId }, { $pull: { users: new mongoose.Types.ObjectId(req.currentUser!.userId) } });
        res.status(HTTP_STATUS.OK).json({ message: 'Book deleted from favorites' });
    }

}
