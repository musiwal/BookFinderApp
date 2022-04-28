import { LeanDocument } from 'mongoose';
import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';

import { BookModel } from '../../models/book.schema';
import { BookCommentModel } from '../../models/book-comment.schema';
import { IBookComment } from '../../interfaces/book.interface';

export class BookComment {
    public async all(req: Request, res: Response): Promise<void> {
        const { bookId } = req.params;
        const allBookComments: IBookComment[] | LeanDocument<IBookComment[]> = await BookCommentModel.find({ bookId })
                                                            .lean()
                                                            .sort({ createdAt: -1 })
                                                            .exec();
        res.status(HTTP_STATUS.OK).json({ message: 'All book comments', comments: allBookComments });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const { bookId, rating, comment } = req.body;
        await BookCommentModel.create({
            bookId,
            comment,
            rating,
            fullname: req.currentUser!.fullname,
            userId: req.currentUser!.userId,
        });
        await BookModel.updateOne({_id: bookId }, { $inc: { rating, ratingCount: rating > 0 ? 1 : 0 } });
        const updatedComments: IBookComment[] = await BookCommentModel.find({ bookId }).sort({ createdAt: -1 });
        const updatedBook = await BookModel.findOne({_id: bookId }).populate('users');
        res.status(HTTP_STATUS.CREATED).json({ message: 'Comment added', book: updatedBook, comments: updatedComments });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { comment, rating } = req.body;
        const { bookId, commentId } = req.params;
        const commentData = await BookCommentModel.findOne({ _id: commentId }) as IBookComment;
        if (commentData.rating > 0 && commentData.rating !== rating) {
            const decrement = BookModel.updateOne({_id: bookId }, { $inc: { rating: -commentData.rating } });
            const increment = BookModel.updateOne({_id: bookId }, { $inc: { rating } });
            await Promise.all([decrement, increment]);
        } else if(commentData.rating === 0 && rating > 0) {
            await BookModel.updateOne({_id: bookId }, { $inc: { rating, ratingCount: 1 } });
        } else if(commentData.rating > 0 && rating === 0) {
            await BookModel.updateOne({_id: bookId }, { $inc: { rating } });
        }
        await BookCommentModel.findOneAndUpdate({ _id: commentId }, { comment, rating }, { new: true, upsert: true });
        const updatedBook = await BookModel.findOne({_id: bookId }).populate('users');
        const updatedComments = await BookCommentModel.find({ bookId: bookId }).sort({ createdAt: -1 });
        res.status(HTTP_STATUS.CREATED).json({ message: 'Comment updated', book: updatedBook, comments: updatedComments });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        await BookCommentModel.findOneAndDelete({ _id: req.params.commentId });
        const updatedComments = await BookCommentModel.find({ bookId: req.params.bookId }).sort({ createdAt: -1 });
        res.status(HTTP_STATUS.CREATED).json({ message: 'Comment deleted', comments: updatedComments });
    }
}