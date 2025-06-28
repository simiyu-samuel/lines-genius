import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/AppError';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      throw new AppError(message, 400);
    }
    
    next();
  };
};

// Common validation schemas
export const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  generateLines: Joi.object({
    category: Joi.string().valid('taglines', 'bios', 'captions', 'quotes', 'slogans', 'adlines').required(),
    tone: Joi.string().valid('funny', 'corporate', 'bold', 'romantic', 'minimalist', 'inspirational', 'motivational').optional(),
    prompt: Joi.string().max(500).optional(),
    count: Joi.number().min(1).max(10).optional(),
  }),

  saveLine: Joi.object({
    text: Joi.string().min(1).max(500).required(),
    category: Joi.string().required(),
    tone: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    email: Joi.string().email().optional(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }),
};