import * as service from './certificate.service.js';
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

export const generateCertificate = async (req, res, next) => {
  try {
    const result = await service.generateCertificate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listCertificates = async (req, res, next) => {
  try {
    const result = await service.listCertificates(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const generateIdCard = async (req, res, next) => {
  try {
    const result = await service.generateIdCard(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listIdCards = async (req, res, next) => {
  try {
    const result = await service.listIdCards(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const verifyCertificate = async (req, res, next) => {
  try {
    const result = await service.verifyCertificate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};
