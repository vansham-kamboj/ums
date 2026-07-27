import Joi from 'joi';

export const create = Joi.object({
  name: Joi.string().allow('', null),
  title: Joi.string().allow('', null),
}).unknown(true);

export const update = Joi.object({
  name: Joi.string().allow('', null),
  title: Joi.string().allow('', null),
}).unknown(true);

export const id = Joi.object({
  id: Joi.string().uuid().required(),
});
