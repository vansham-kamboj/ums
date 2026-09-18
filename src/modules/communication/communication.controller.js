import * as service from './communication.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/apiResponse.js';
import { getPagination } from '../../utils/pagination.js';


// Standard CRUD handlers
export const list = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const result = await service.list(req.teamId, req.query, pagination);
    return paginatedResponse(res, 'Records retrieved', result.data, { ...pagination, total: result.total });
  } catch (error) { next(error); }
};

export const getById = async (req, res, next) => {
  try {
    const item = await service.getById(req.params.id, req.teamId);
    if (!item) return errorResponse(res, 'Record not found', 404);
    return successResponse(res, 'Record retrieved', item);
  } catch (error) { next(error); }
};

export const create = async (req, res, next) => {
  try {
    const item = await service.create(req.body, req.teamId, req.user.id);
    return successResponse(res, 'Record created', item, 201);
  } catch (error) { next(error); }
};

export const update = async (req, res, next) => {
  try {
    const item = await service.update(req.params.id, req.body, req.teamId);
    return successResponse(res, 'Record updated', item);
  } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id, req.teamId);
    return successResponse(res, 'Record deleted');
  } catch (error) { next(error); }
};


// Module-specific handlers

export const sendCommunication = async (req, res, next) => {
  try {
    const result = await service.sendCommunication(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listCommunicationRecords = async (req, res, next) => {
  try {
    const result = await service.listCommunicationRecords(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listMailTemplates = async (req, res, next) => {
  try {
    const result = await service.listMailTemplates(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createMailTemplate = async (req, res, next) => {
  try {
    const result = await service.createMailTemplate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const updateMailTemplate = async (req, res, next) => {
  try {
    const result = await service.updateMailTemplate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const deleteMailTemplate = async (req, res, next) => {
  try {
    const result = await service.deleteMailTemplate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listSmsTemplates = async (req, res, next) => {
  try {
    const result = await service.listSmsTemplates(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createSmsTemplate = async (req, res, next) => {
  try {
    const result = await service.createSmsTemplate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const updateSmsTemplate = async (req, res, next) => {
  try {
    const result = await service.updateSmsTemplate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const deleteSmsTemplate = async (req, res, next) => {
  try {
    const result = await service.deleteSmsTemplate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listWhatsappTemplates = async (req, res, next) => {
  try {
    const result = await service.listWhatsappTemplates(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createWhatsappTemplate = async (req, res, next) => {
  try {
    const result = await service.createWhatsappTemplate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const updateWhatsappTemplate = async (req, res, next) => {
  try {
    const result = await service.updateWhatsappTemplate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const deleteWhatsappTemplate = async (req, res, next) => {
  try {
    const result = await service.deleteWhatsappTemplate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listPushTemplates = async (req, res, next) => {
  try {
    const result = await service.listPushTemplates(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createPushTemplate = async (req, res, next) => {
  try {
    const result = await service.createPushTemplate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const updatePushTemplate = async (req, res, next) => {
  try {
    const result = await service.updatePushTemplate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const deletePushTemplate = async (req, res, next) => {
  try {
    const result = await service.deletePushTemplate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};
