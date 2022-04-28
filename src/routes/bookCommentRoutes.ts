import express, { Router } from 'express';
import { BookComment } from './../controllers/books/bookComment';

class BookCommentRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get('/comment/book/:bookId', BookComment.prototype.all);
        this.router.post('/comment/book', BookComment.prototype.create);
        this.router.put('/comment/book/:bookId/:commentId', BookComment.prototype.update);
        this.router.delete('/comment/book/:bookId/:commentId', BookComment.prototype.delete);

        return this.router;
    }
}

export const bookCommentRoutes: BookCommentRoutes = new BookCommentRoutes();
