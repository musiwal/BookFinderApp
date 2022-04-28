import mongoose, { model, Model, Schema } from 'mongoose';
import { hash, compare } from 'bcryptjs';
import { IUserDocument } from '../interfaces/user.interface';

const SALT_ROUND = 10;

const userSchema: Schema = new Schema(
    {
        fullname: { type: String, index: true },
        email: { type: String },
        password: { type: String },
        city: { type: String },
        phoneNumber: { type: String, default: '' },
        favoriteBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book'}],
        createdAt: { type: Date, default: Date.now, index: true }
    },
    {
        toJSON: {
            transform(_doc, ret) {
                delete ret.password;
                return ret;
            }
        }
    }
);

userSchema.pre('save', async function (this: IUserDocument, next: () => void) {
    const hashedPassword: string = await hash(this.password as string, SALT_ROUND);
    this.password = hashedPassword;
    next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    const hashedPassword: string = ((this as unknown) as IUserDocument).password!;
    return compare(password, hashedPassword);
};

userSchema.methods.hashPassword = async function (password: string): Promise<string> {
    return hash(password, SALT_ROUND);
};

const UserModel: Model<IUserDocument> = model<IUserDocument>('User', userSchema, 'User');
export { UserModel };
