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
    prisma.sitePage.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.sitePage.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.sitePage.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.sitePage.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.sitePage.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.sitePage.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const getWebsiteConfig = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getWebsiteConfig
  // TODO: Add specific business logic
  return { message: 'getWebsiteConfig executed', params, body: Object.keys(body) };
};

export const updateWebsiteConfig = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for updateWebsiteConfig
  // TODO: Add specific business logic
  return { message: 'updateWebsiteConfig executed', params, body: Object.keys(body) };
};

export const addSiteBlock = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addSiteBlock
  // TODO: Add specific business logic
  return { message: 'addSiteBlock executed', params, body: Object.keys(body) };
};

export const updateSiteBlock = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for updateSiteBlock
  // TODO: Add specific business logic
  return { message: 'updateSiteBlock executed', params, body: Object.keys(body) };
};

export const deleteSiteBlock = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for deleteSiteBlock
  // TODO: Add specific business logic
  return { message: 'deleteSiteBlock executed', params, body: Object.keys(body) };
};

export const getPublicPage = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getPublicPage
  // TODO: Add specific business logic
  return { message: 'getPublicPage executed', params, body: Object.keys(body) };
};
