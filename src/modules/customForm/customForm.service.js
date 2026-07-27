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
    prisma.customForm.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.customForm.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.customForm.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.customForm.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.customForm.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.customForm.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const addFormField = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addFormField
  // TODO: Add specific business logic
  return { message: 'addFormField executed', params, body: Object.keys(body) };
};

export const updateFormField = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for updateFormField
  // TODO: Add specific business logic
  return { message: 'updateFormField executed', params, body: Object.keys(body) };
};

export const deleteFormField = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for deleteFormField
  // TODO: Add specific business logic
  return { message: 'deleteFormField executed', params, body: Object.keys(body) };
};

export const submitForm = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for submitForm
  // TODO: Add specific business logic
  return { message: 'submitForm executed', params, body: Object.keys(body) };
};

export const listSubmissions = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listSubmissions
  // TODO: Add specific business logic
  return { message: 'listSubmissions executed', params, body: Object.keys(body) };
};
