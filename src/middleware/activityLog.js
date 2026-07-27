import prisma from '../config/database.js';

/**
 * Activity Log Middleware
 * Automatically logs write operations (POST, PUT, PATCH, DELETE)
 */
export const activityLogger = (req, res, next) => {
  const originalEnd = res.end;

  res.end = function (...args) {
    // Only log mutating requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const statusCode = res.statusCode;
      if (statusCode >= 200 && statusCode < 400) {
        // Fire and forget — don't block the response
        prisma.activityLog.create({
          data: {
            teamId: req.teamId || null,
            userId: req.user?.id || null,
            action: `${req.method} ${req.originalUrl}`,
            module: req.originalUrl.split('/')[2] || 'unknown',
            description: `${req.method} ${req.originalUrl} - ${statusCode}`,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
          },
        }).catch(err => {
          console.error('Activity log error:', err.message);
        });
      }
    }

    originalEnd.apply(res, args);
  };

  next();
};
