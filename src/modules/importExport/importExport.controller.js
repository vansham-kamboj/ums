import * as service from './importExport.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/apiResponse.js';
import { getPagination } from '../../utils/pagination.js';



// Module-specific handlers

export const handleImport = async (req, res, next) => {
  try {
    const result = await service.handleImport(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listImportJobs = async (req, res, next) => {
  try {
    const result = await service.listImportJobs(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const rollbackStudentImport = async (req, res, next) => {
  try {
    const result = await service.rollbackStudentImport(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const handleExport = async (req, res, next) => {
  try {
    const result = await service.handleExport(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listExportJobs = async (req, res, next) => {
  try {
    const result = await service.listExportJobs(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};
