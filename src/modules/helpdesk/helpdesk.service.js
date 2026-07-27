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
    prisma.ticket.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.ticket.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.ticket.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.ticket.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.ticket.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.ticket.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const addTicketMessage = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addTicketMessage
  // TODO: Add specific business logic
  return { message: 'addTicketMessage executed', params, body: Object.keys(body) };
};

export const updateTicketStatus = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for updateTicketStatus
  // TODO: Add specific business logic
  return { message: 'updateTicketStatus executed', params, body: Object.keys(body) };
};

export const assignTicket = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for assignTicket
  // TODO: Add specific business logic
  return { message: 'assignTicket executed', params, body: Object.keys(body) };
};
