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
    prisma.conversation.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.conversation.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.conversation.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.conversation.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.conversation.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.conversation.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const listMessages = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listMessages
  // TODO: Add specific business logic
  return { message: 'listMessages executed', params, body: Object.keys(body) };
};

export const sendMessage = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for sendMessage
  // TODO: Add specific business logic
  return { message: 'sendMessage executed', params, body: Object.keys(body) };
};

export const markMessageRead = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for markMessageRead
  // TODO: Add specific business logic
  return { message: 'markMessageRead executed', params, body: Object.keys(body) };
};

export const searchChatUsers = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for searchChatUsers
  // TODO: Add specific business logic
  return { message: 'searchChatUsers executed', params, body: Object.keys(body) };
};
