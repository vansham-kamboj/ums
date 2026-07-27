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
    prisma.task.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.task.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.task.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.task.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.task.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.task.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const addTaskMember = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addTaskMember
  // TODO: Add specific business logic
  return { message: 'addTaskMember executed', params, body: Object.keys(body) };
};

export const removeTaskMember = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for removeTaskMember
  // TODO: Add specific business logic
  return { message: 'removeTaskMember executed', params, body: Object.keys(body) };
};

export const addChecklist = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addChecklist
  // TODO: Add specific business logic
  return { message: 'addChecklist executed', params, body: Object.keys(body) };
};

export const toggleChecklist = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for toggleChecklist
  // TODO: Add specific business logic
  return { message: 'toggleChecklist executed', params, body: Object.keys(body) };
};

export const deleteChecklist = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for deleteChecklist
  // TODO: Add specific business logic
  return { message: 'deleteChecklist executed', params, body: Object.keys(body) };
};
