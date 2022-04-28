import Joi, { ObjectSchema, ValidationError } from 'joi';
import { IUserDocument } from '../../interfaces/user.interface';

async function validateSignup(body: IUserDocument): Promise<ValidationError | undefined> {
    const signupSchema: ObjectSchema = Joi.object().keys({
        fullname: Joi.string().required().min(4).max(12).messages({
            'string.base': 'Fullname must be of type string',
            'string.min': 'Fullname must have a minimum length of {#limit}',
            'string.max': 'Fullname must have a maximum length of {#limit}',
            'string.empty': 'Fullname is a required field'
        }),
        password: Joi.string().required().min(4).max(8).messages({
            'string.base': 'Password must be of type string',
            'string.min': 'Password must have a minimum length of {#limit}',
            'string.max': 'Password must have a maximum length of {#limit}',
            'string.empty': 'Password is a required field'
        }),
        email: Joi.string().required().email().messages({
            'string.base': 'Email must be of type string',
            'string.email': 'Email must be valid',
            'string.empty': 'Email is a required field'
        }),
        city: Joi.string().required().min(4).max(12).messages({
            'string.base': 'City must be of type string',
            'string.min': 'City must have a minimum length of {#limit}',
            'string.max': 'City must have a maximum length of {#limit}',
            'string.empty': 'City is a required field'
        }),
        phoneNumber: Joi.string().required().min(4).max(12).messages({
            'string.min': 'Phone number  must have a minimum length of {#limit}',
            'string.max': 'City must have a maximum length of {#limit}',
            'string.empty': 'Phone number  is a required field'
        }),
    });
    const { error } = await Promise.resolve(signupSchema.validate(body));
    return error;
}

async function validateLogin(body: IUserDocument): Promise<ValidationError | undefined> {
    const loginSchema: ObjectSchema = Joi.object().keys({
        email: Joi.string().required().email().messages({
            'string.base': 'Email must be of type string',
            'string.email': 'Email must be valid',
            'string.empty': 'Email is a required field'
        }),
        password: Joi.string().required().min(4).max(8).messages({
            'string.base': 'Password must be of type string',
            'string.min': 'Password must have a minimum length of {#limit}',
            'string.max': 'Password must have a maximum length of {#limit}',
            'string.empty': 'Password is a required field'
        }),
    });
    const { error } = await Promise.resolve(loginSchema.validate(body));
    return error;
}

export { validateSignup, validateLogin };