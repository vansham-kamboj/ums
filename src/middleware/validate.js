import { errorResponse } from '../utils/apiResponse.js';

/**
 * Joi Validation Middleware Factory
 * Validates request body, query, or params against a Joi schema
 *
 * @param {object} schema - Joi schema object with optional body, query, params keys
 * @returns Express middleware
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    if (schema.body) {
      const { error } = schema.body.validate(req.body, { abortEarly: false, stripUnknown: true });
      if (error) {
        errors.push(...error.details.map(d => ({ field: d.path.join('.'), message: d.message })));
      } else {
        req.body = schema.body.validate(req.body, { stripUnknown: true }).value;
      }
    }

    if (schema.query) {
      const { error } = schema.query.validate(req.query, { abortEarly: false, stripUnknown: true });
      if (error) {
        errors.push(...error.details.map(d => ({ field: d.path.join('.'), message: d.message })));
      } else {
        req.query = schema.query.validate(req.query, { stripUnknown: true }).value;
      }
    }

    if (schema.params) {
      const { error } = schema.params.validate(req.params, { abortEarly: false, stripUnknown: true });
      if (error) {
        errors.push(...error.details.map(d => ({ field: d.path.join('.'), message: d.message })));
      }
    }

    if (errors.length > 0) {
      return errorResponse(res, 'Validation failed', 422, { errors });
    }

    next();
  };
};
