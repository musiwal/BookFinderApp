import express, { Router } from 'express';
import { Book } from './../controllers/books/book';

class BookRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get('/books/:page', Book.prototype.all);
        this.router.get('/book/:bookId', Book.prototype.single);
        this.router.get('/book/search/:query', Book.prototype.search);

        return this.router;
    }
}

export const bookRoutes: BookRoutes = new BookRoutes();
