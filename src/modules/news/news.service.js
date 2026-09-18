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
    prisma.newsArticle.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.newsArticle.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.newsArticle.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.newsArticle.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.newsArticle.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.newsArticle.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const listPublicNews = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listPublicNews
  // TODO: Add specific business logic
  return { message: 'listPublicNews executed', params, body: Object.keys(body) };
};

export const getPublicNewsArticle = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getPublicNewsArticle
  // TODO: Add specific business logic
  return { message: 'getPublicNewsArticle executed', params, body: Object.keys(body) };
};
