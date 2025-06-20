// src/validation/students.js

import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
    phoneNumber: Joi.number().required(),
    email: Joi.string().min(3).max(30),
    isFavourite: Joi.boolean(),
  contactType: Joi.string().min(3).max(30).valid('work','home', 'personal').required(),

});

export const patchContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
    phoneNumber: Joi.number(),
    email: Joi.string().min(3).max(30),
    isFavourite: Joi.boolean(),
  contactType: Joi.string().min(3).max(30).valid('work','home', 'personal'),

});