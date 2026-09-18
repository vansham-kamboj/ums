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
    prisma.trip.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.trip.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.trip.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.trip.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.trip.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.trip.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const addParticipant = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addParticipant
  // TODO: Add specific business logic
  return { message: 'addParticipant executed', params, body: Object.keys(body) };
};

export const removeParticipant = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for removeParticipant
  // TODO: Add specific business logic
  return { message: 'removeParticipant executed', params, body: Object.keys(body) };
};
