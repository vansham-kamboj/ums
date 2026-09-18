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
    prisma.hostelBlock.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.hostelBlock.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.hostelBlock.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.hostelBlock.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.hostelBlock.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.hostelBlock.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const allocateRoom = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for allocateRoom
  // TODO: Add specific business logic
  return { message: 'allocateRoom executed', params, body: Object.keys(body) };
};

export const deallocateRoom = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for deallocateRoom
  // TODO: Add specific business logic
  return { message: 'deallocateRoom executed', params, body: Object.keys(body) };
};

export const getRoomAvailability = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getRoomAvailability
  // TODO: Add specific business logic
  return { message: 'getRoomAvailability executed', params, body: Object.keys(body) };
};
