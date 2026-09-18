import prisma from '../../config/database.js';
import { buildSearchFilter } from '../../utils/pagination.js';
import { generateExcel } from '../../services/excel.service.js';


// ==================== Standard CRUD ====================

export const list = async (teamId, query = {}, pagination = {}) => {
  const where = {
    ...(teamId ? { teamId } : {}),
    ...buildSearchFilter(query.search, ['name', 'title']),
  };
  const [data, total] = await Promise.all([
    prisma.blogPost.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.blogPost.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.blogPost.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.blogPost.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.blogPost.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.blogPost.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const listPublicBlogs = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listPublicBlogs
  // TODO: Add specific business logic
  return { message: 'listPublicBlogs executed', params, body: Object.keys(body) };
};

export const getPublicBlog = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getPublicBlog
  // TODO: Add specific business logic
  return { message: 'getPublicBlog executed', params, body: Object.keys(body) };
};
