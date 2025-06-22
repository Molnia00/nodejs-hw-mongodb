
import Joi from 'joi';

export const createAuthSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string(),
    password: Joi.number().required(),

});

export const loginSchema = Joi.object({
    email: Joi.string(),
    password: Joi.number().required(),

});