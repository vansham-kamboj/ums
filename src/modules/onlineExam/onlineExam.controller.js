import * as service from './onlineExam.service.js';
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

export const listQuestions = async (req, res, next) => {
  try {
    const result = await service.listQuestions(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const addQuestion = async (req, res, next) => {
  try {
    const result = await service.addQuestion(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const result = await service.updateQuestion(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const result = await service.deleteQuestion(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const submitExam = async (req, res, next) => {
  try {
    const result = await service.submitExam(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listSubmissions = async (req, res, next) => {
  try {
    const result = await service.listSubmissions(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getResults = async (req, res, next) => {
  try {
    const result = await service.getResults(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};
