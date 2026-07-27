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
    prisma.menuItem.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.menuItem.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.menuItem.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.menuItem.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.menuItem.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.menuItem.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const getTodaySchedule = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getTodaySchedule
  // TODO: Add specific business logic
  return { message: 'getTodaySchedule executed', params, body: Object.keys(body) };
};
