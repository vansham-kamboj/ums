/**
 * Pagination helper — extracts page/limit from query params
 * and returns Prisma-compatible skip/take
 */
export const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;

  return { page, limit, skip, take: limit };
};

/**
 * Sort helper — extracts sort field/order from query params
 */
export const getSort = (query, allowedFields = [], defaultField = 'createdAt', defaultOrder = 'desc') => {
  const sortBy = allowedFields.includes(query.sortBy) ? query.sortBy : defaultField;
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : defaultOrder;

  return { [sortBy]: sortOrder };
};

/**
 * Search filter helper — builds Prisma OR conditions for search
 */
export const buildSearchFilter = (searchTerm, fields) => {
  if (!searchTerm) return {};

  return {
    OR: fields.map(field => ({
      [field]: { contains: searchTerm, mode: 'insensitive' },
    })),
  };
};
