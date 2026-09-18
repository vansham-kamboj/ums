import Joi from 'joi';

export const create = Joi.object({
  name: Joi.string().required(),
}).unknown(true);

export const update = Joi.object({
  name: Joi.string(),
}).unknown(true);

export const id = Joi.object({
  id: Joi.string().uuid().required(),
});
