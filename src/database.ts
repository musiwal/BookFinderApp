import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();

var url = process.env.MONGO_URI || 'mongodb://localhost:27017/book-finder'

export default () => {
    const connect = () => {
        mongoose
            .connect(url)
            .then(() => {
                return console.log('Successfully connected to database.');
            })
            .catch((error) => {
                console.log('Error connecting to database', error);
                return process.exit(1);
            });
    };
    connect();

    mongoose.connection.on('disconnected', connect);
};