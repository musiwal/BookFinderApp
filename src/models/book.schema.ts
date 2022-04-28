import mongoose, { model, Model, Schema } from 'mongoose';
import { IBook } from '../interfaces/book.interface';

const bookSchema: Schema = new Schema(
    {
        title: { type: String, index: true },
        isbn: { type: String },
        thumbnailUrl: { type: String },
        shortDescription: { type: String },
        longDescription: { type: String },
        status: { type: String },
        authors: [String],
        categories: [String],
        rating: { type: Number, default: 0 },
        ratingCount: { type: Number, default: 0 },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    }
);

const BookModel: Model<IBook> = model<IBook>('Book', bookSchema, 'Book');
export { BookModel };
