import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface IBook extends Document {
    _id?: string | ObjectId;
    title: string,
    isbn: string,
    thumbnailUrl: string,
    shortDescription: string,
    longDescription: string,
    status: string,
    authors: string[],
    categories: string[],
    rating: number[];
    ratingCount: number;
    users: string[];
}

export interface IBookComment extends Document {
    _id?: string | ObjectId;
    userId: string | ObjectId;
    fullname: string,
    bookId: string | ObjectId,
    comment: string,
    rating: number,
    createdAt: Date
}