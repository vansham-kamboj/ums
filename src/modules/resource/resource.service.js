import prisma from '../../config/database.js';
import { buildSearchFilter } from '../../utils/pagination.js';
import { generateExcel } from '../../services/excel.service.js';


// ==================== Standard CRUD ====================

export const list = async (teamId, query = {}, pagination = {}) => {
  const where = {
    
    ...buildSearchFilter(query.search, ['name', 'title']),
  };
  const [data, total] = await Promise.all([
    prisma.assignment.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.assignment.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.assignment.findFirst({ where: { id } });
};

export const create = async (data, teamId, userId) => {
  return prisma.assignment.create({ data: { ...data,  } });
};

export const update = async (id, data, teamId) => {
  return prisma.assignment.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.assignment.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const submitAssignment = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for submitAssignment
  // TODO: Add specific business logic
  return { message: 'submitAssignment executed', params, body: Object.keys(body) };
};

export const evaluateAssignment = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for evaluateAssignment
  // TODO: Add specific business logic
  return { message: 'evaluateAssignment executed', params, body: Object.keys(body) };
};

export const addSyllabusUnit = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addSyllabusUnit
  // TODO: Add specific business logic
  return { message: 'addSyllabusUnit executed', params, body: Object.keys(body) };
};
