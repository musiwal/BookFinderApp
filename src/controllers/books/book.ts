import { LeanDocument } from 'mongoose';
import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';

import { BookModel } from '../../models/book.schema';
import booksJson from './books.json';
import { IBook } from '../../interfaces/book.interface';

const PAGE_SIZE = 20;

export class Book {
    // This is used for only loading some book data to database
    public async create(req: Request, res: Response): Promise<void> {
        for(let i = 0; i < booksJson.length; i++) {
            await BookModel.create(booksJson[i]);
        }
        res.status(HTTP_STATUS.CREATED).json({ message: 'Books added successfully' });
    }

    public async all(req: Request, res: Response): Promise<void> {
        const { page } = req.params;
        const skip: number = (parseInt(page) - 1) * PAGE_SIZE;
        const limit: number = PAGE_SIZE * parseInt(page);
        const allBooks: IBook[] | LeanDocument<IBook[]> = await BookModel.find({})
                                                            .lean()
                                                            .skip(skip)
                                                            .limit(limit)
                                                            .sort({ createdAt: -1 })
                                                            .exec();
        res.status(HTTP_STATUS.OK).json({ message: 'All books', books: allBooks });
    }

    public async single(req: Request, res: Response): Promise<void> {
        const { bookId } = req.params;
        const book: IBook = await BookModel.findOne({ _id: bookId }).exec() as IBook;
        res.status(HTTP_STATUS.OK).json({ message: 'Single book', book: book });
    }

    public async search(req: Request, res: Response): Promise<void> {
        const searchTerm: string = req.params.query.toLowerCase();
        const books: IBook[] = await BookModel.find({});
        const result: IBook[] = books.map((book: IBook) => Book.prototype.filterItem(book, searchTerm)) as IBook[];
        const filtered: IBook[] = result.filter((element: IBook) => {
            return Object.keys(element).length;
        });
        res.status(HTTP_STATUS.CREATED).json({ 
            message: filtered.length ? 'Books found' : 'No book found', 
            books: filtered 
        });
    }

    private filterItem(book: IBook, searchTerm: string) {
        let result: IBook[] = [];
        if (book.title.toLowerCase().includes(searchTerm)) {
            result.push(book);
        } else {
            let authorResult = book.authors.map((author: string, index: number) => {
                book.authors[index] = author.toLowerCase();
                if (book.authors[index].includes(searchTerm)) {
                  result.push(book);
                }
            });
            authorResult = authorResult.filter((element) => element !== undefined);
            if (authorResult.length === 0) {
                book.categories.map((category: string, index: number) => {
                book.categories[index] = category.toLowerCase();
                    if (book.categories[index].includes(searchTerm)) {
                        result.push(book);
                    }
                });
            }
        }
        return result.length > 0 ? result[0] : [];
    }
}