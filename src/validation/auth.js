
import Joi from 'joi';

export const createAuthSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email(),
    password: Joi.number().required(),

});

export const loginSchema = Joi.object({
    email: Joi.string().email(),
    password: Joi.number().required(),

});

export const resetEmailSchema = Joi.object({
    email: Joi.string().email().required(),
   
});

export const resetPasswordSchema = Joi.object({
    password: Joi.string().required(),
    token : Joi.string().required(),
})
