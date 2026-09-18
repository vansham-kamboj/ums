import prisma from '../../config/database.js';
import { buildSearchFilter } from '../../utils/pagination.js';
import { generateExcel } from '../../services/excel.service.js';


// ==================== Standard CRUD ====================

export const list = async (teamId, query = {}, pagination = {}) => {
  const where = {
    
    ...buildSearchFilter(query.search, ['name', 'title']),
  };
  const [data, total] = await Promise.all([
    prisma.notification.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.notification.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.notification.findFirst({ where: { id } });
};

export const create = async (data, teamId, userId) => {
  return prisma.notification.create({ data: { ...data,  } });
};

export const update = async (id, data, teamId) => {
  return prisma.notification.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.notification.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const listNotifications = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listNotifications
  // TODO: Add specific business logic
  return { message: 'listNotifications executed', params, body: Object.keys(body) };
};

export const markAsRead = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for markAsRead
  // TODO: Add specific business logic
  return { message: 'markAsRead executed', params, body: Object.keys(body) };
};

export const markAllAsRead = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for markAllAsRead
  // TODO: Add specific business logic
  return { message: 'markAllAsRead executed', params, body: Object.keys(body) };
};

export const getUnreadCount = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getUnreadCount
  // TODO: Add specific business logic
  return { message: 'getUnreadCount executed', params, body: Object.keys(body) };
};

export const registerDevice = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for registerDevice
  // TODO: Add specific business logic
  return { message: 'registerDevice executed', params, body: Object.keys(body) };
};

export const listReminders = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listReminders
  // TODO: Add specific business logic
  return { message: 'listReminders executed', params, body: Object.keys(body) };
};

export const createReminder = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createReminder
  // TODO: Add specific business logic
  return { message: 'createReminder executed', params, body: Object.keys(body) };
};

export const updateReminder = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for updateReminder
  // TODO: Add specific business logic
  return { message: 'updateReminder executed', params, body: Object.keys(body) };
};

export const deleteReminder = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for deleteReminder
  // TODO: Add specific business logic
  return { message: 'deleteReminder executed', params, body: Object.keys(body) };
};
