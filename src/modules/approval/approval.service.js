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
    prisma.approvalType.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.approvalType.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.approvalType.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.approvalType.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.approvalType.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.approvalType.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const addApprovalLevel = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addApprovalLevel
  // TODO: Add specific business logic
  return { message: 'addApprovalLevel executed', params, body: Object.keys(body) };
};

export const submitApprovalRequest = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for submitApprovalRequest
  // TODO: Add specific business logic
  return { message: 'submitApprovalRequest executed', params, body: Object.keys(body) };
};

export const approveRequest = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for approveRequest
  // TODO: Add specific business logic
  return { message: 'approveRequest executed', params, body: Object.keys(body) };
};

export const rejectRequest = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for rejectRequest
  // TODO: Add specific business logic
  return { message: 'rejectRequest executed', params, body: Object.keys(body) };
};
