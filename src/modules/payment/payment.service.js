import prisma from '../../config/database.js';
import { buildSearchFilter } from '../../utils/pagination.js';
import { generateExcel } from '../../services/excel.service.js';


// ==================== Standard CRUD ====================

export const list = async (teamId, query = {}, pagination = {}) => {
  const where = {
    
    ...buildSearchFilter(query.search, ['name', 'title']),
  };
  const [data, total] = await Promise.all([
    prisma.paymentGatewayConfig.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.paymentGatewayConfig.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.paymentGatewayConfig.findFirst({ where: { id } });
};

export const create = async (data, teamId, userId) => {
  return prisma.paymentGatewayConfig.create({ data: { ...data,  } });
};

export const update = async (id, data, teamId) => {
  return prisma.paymentGatewayConfig.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.paymentGatewayConfig.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const initiatePayment = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for initiatePayment
  // TODO: Add specific business logic
  return { message: 'initiatePayment executed', params, body: Object.keys(body) };
};

export const verifyPayment = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for verifyPayment
  // TODO: Add specific business logic
  return { message: 'verifyPayment executed', params, body: Object.keys(body) };
};

export const getPaymentStatus = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getPaymentStatus
  // TODO: Add specific business logic
  return { message: 'getPaymentStatus executed', params, body: Object.keys(body) };
};

export const listActiveGateways = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listActiveGateways
  // TODO: Add specific business logic
  return { message: 'listActiveGateways executed', params, body: Object.keys(body) };
};

export const guestPayment = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for guestPayment
  // TODO: Add specific business logic
  return { message: 'guestPayment executed', params, body: Object.keys(body) };
};

export const handleWebhook = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for handleWebhook
  // TODO: Add specific business logic
  return { message: 'handleWebhook executed', params, body: Object.keys(body) };
};
