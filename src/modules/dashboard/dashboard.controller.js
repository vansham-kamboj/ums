import * as service from './dashboard.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/apiResponse.js';
import { getPagination } from '../../utils/pagination.js';



// Module-specific handlers

export const getAdminDashboard = async (req, res, next) => {
  try {
    const result = await service.getAdminDashboard(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getStudentDashboard = async (req, res, next) => {
  try {
    const result = await service.getStudentDashboard(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getGuardianDashboard = async (req, res, next) => {
  try {
    const result = await service.getGuardianDashboard(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getStats = async (req, res, next) => {
  try {
    const result = await service.getStats(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getStudentCharts = async (req, res, next) => {
  try {
    const result = await service.getStudentCharts(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getTransactionCharts = async (req, res, next) => {
  try {
    const result = await service.getTransactionCharts(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getFeeCharts = async (req, res, next) => {
  try {
    const result = await service.getFeeCharts(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getBirthdays = async (req, res, next) => {
  try {
    const result = await service.getBirthdays(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getSchedule = async (req, res, next) => {
  try {
    const result = await service.getSchedule(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getDashboardTimetable = async (req, res, next) => {
  try {
    const result = await service.getDashboardTimetable(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getDashboardGalleries = async (req, res, next) => {
  try {
    const result = await service.getDashboardGalleries(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getDashboardForms = async (req, res, next) => {
  try {
    const result = await service.getDashboardForms(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getPinnedItems = async (req, res, next) => {
  try {
    const result = await service.getPinnedItems(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};
