import express, { Router } from 'express';
import { User } from './../controllers/users/user';

class UserRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get('/user', User.prototype.profile);
        this.router.put('/user/book/:bookId', User.prototype.addBookToFavorites);
        this.router.delete('/user/book/:bookId', User.prototype.deleteFavorite);

        return this.router;
    }
}

export const userRoutes: UserRoutes = new UserRoutes();
