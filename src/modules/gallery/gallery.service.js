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
    prisma.gallery.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.gallery.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.gallery.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.gallery.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.gallery.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.gallery.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const addGalleryImage = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addGalleryImage
  // TODO: Add specific business logic
  return { message: 'addGalleryImage executed', params, body: Object.keys(body) };
};

export const deleteGalleryImage = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for deleteGalleryImage
  // TODO: Add specific business logic
  return { message: 'deleteGalleryImage executed', params, body: Object.keys(body) };
};

export const listPublicGalleries = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listPublicGalleries
  // TODO: Add specific business logic
  return { message: 'listPublicGalleries executed', params, body: Object.keys(body) };
};

export const getPublicGallery = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getPublicGallery
  // TODO: Add specific business logic
  return { message: 'getPublicGallery executed', params, body: Object.keys(body) };
};
