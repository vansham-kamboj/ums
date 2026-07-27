import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global Error Handler Middleware
 * Catches all unhandled errors and returns a consistent response
 */
export const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return errorResponse(res, 'File too large', 413);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return errorResponse(res, 'Unexpected file field', 400);
  }

  // Prisma errors
  if (err.code === 'P2002') {
    const field = err.meta?.target?.join(', ') || 'field';
    return errorResponse(res, `Duplicate value for: ${field}`, 409);
  }

  if (err.code === 'P2025') {
    return errorResponse(res, 'Record not found', 404);
  }

  if (err.code === 'P2003') {
    return errorResponse(res, 'Related record not found', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  // Joi validation errors
  if (err.isJoi) {
    return errorResponse(res, 'Validation error', 422, {
      errors: err.details.map(d => ({
        field: d.path.join('.'),
        message: d.message,
      })),
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  return errorResponse(res, message, statusCode);
};

/**
 * Not Found Handler
 */
export const notFoundHandler = (req, res) => {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};
