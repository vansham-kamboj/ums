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
    prisma.event.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.event.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.event.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.event.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.event.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.event.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const assignEventIncharge = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for assignEventIncharge
  // TODO: Add specific business logic
  return { message: 'assignEventIncharge executed', params, body: Object.keys(body) };
};

export const getCombinedCalendar = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getCombinedCalendar
  // TODO: Add specific business logic
  return { message: 'getCombinedCalendar executed', params, body: Object.keys(body) };
};
