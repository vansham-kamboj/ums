import * as service from './report.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/apiResponse.js';
import { getPagination } from '../../utils/pagination.js';



// Module-specific handlers

export const studentProfileReport = async (req, res, next) => {
  try {
    const result = await service.studentProfileReport(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const studentAttendanceReport = async (req, res, next) => {
  try {
    const result = await service.studentAttendanceReport(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const subjectWiseStudentReport = async (req, res, next) => {
  try {
    const result = await service.subjectWiseStudentReport(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const siblingReport = async (req, res, next) => {
  try {
    const result = await service.siblingReport(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const examMarksReport = async (req, res, next) => {
  try {
    const result = await service.examMarksReport(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const dayBookReport = async (req, res, next) => {
  try {
    const result = await service.dayBookReport(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const feeSummaryReport = async (req, res, next) => {
  try {
    const result = await service.feeSummaryReport(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const headWiseFeeSummary = async (req, res, next) => {
  try {
    const result = await service.headWiseFeeSummary(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const concessionSummaryReport = async (req, res, next) => {
  try {
    const result = await service.concessionSummaryReport(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const gatewayReport = async (req, res, next) => {
  try {
    const result = await service.gatewayReport(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const transportFinanceReport = async (req, res, next) => {
  try {
    const result = await service.transportFinanceReport(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const employeeAttendanceReport = async (req, res, next) => {
  try {
    const result = await service.employeeAttendanceReport(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};
