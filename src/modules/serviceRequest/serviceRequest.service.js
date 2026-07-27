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
    prisma.serviceAllocation.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.serviceAllocation.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.serviceAllocation.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.serviceAllocation.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.serviceAllocation.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.serviceAllocation.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const updateServiceRequestStatus = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for updateServiceRequestStatus
  // TODO: Add specific business logic
  return { message: 'updateServiceRequestStatus executed', params, body: Object.keys(body) };
};

export const reviewEditRequest = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for reviewEditRequest
  // TODO: Add specific business logic
  return { message: 'reviewEditRequest executed', params, body: Object.keys(body) };
};
