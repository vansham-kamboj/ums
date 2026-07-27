import * as service from './employee.service.js';
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

export const listDesignations = async (req, res, next) => {
  try {
    const result = await service.listDesignations(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createDesignation = async (req, res, next) => {
  try {
    const result = await service.createDesignation(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const updateDesignation = async (req, res, next) => {
  try {
    const result = await service.updateDesignation(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const deleteDesignation = async (req, res, next) => {
  try {
    const result = await service.deleteDesignation(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getEmployeeDocuments = async (req, res, next) => {
  try {
    const result = await service.getEmployeeDocuments(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const addEmployeeDocument = async (req, res, next) => {
  try {
    const result = await service.addEmployeeDocument(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getEmployeeQualifications = async (req, res, next) => {
  try {
    const result = await service.getEmployeeQualifications(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const addEmployeeQualification = async (req, res, next) => {
  try {
    const result = await service.addEmployeeQualification(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getEmployeeExperience = async (req, res, next) => {
  try {
    const result = await service.getEmployeeExperience(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const addEmployeeExperience = async (req, res, next) => {
  try {
    const result = await service.addEmployeeExperience(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const markAttendance = async (req, res, next) => {
  try {
    const result = await service.markAttendance(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getAttendanceRecords = async (req, res, next) => {
  try {
    const result = await service.getAttendanceRecords(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getAttendanceSummary = async (req, res, next) => {
  try {
    const result = await service.getAttendanceSummary(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listWorkShifts = async (req, res, next) => {
  try {
    const result = await service.listWorkShifts(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createWorkShift = async (req, res, next) => {
  try {
    const result = await service.createWorkShift(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const assignWorkShift = async (req, res, next) => {
  try {
    const result = await service.assignWorkShift(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createTimesheet = async (req, res, next) => {
  try {
    const result = await service.createTimesheet(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listTimesheets = async (req, res, next) => {
  try {
    const result = await service.listTimesheets(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listLeaveTypes = async (req, res, next) => {
  try {
    const result = await service.listLeaveTypes(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createLeaveType = async (req, res, next) => {
  try {
    const result = await service.createLeaveType(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createLeaveAllocation = async (req, res, next) => {
  try {
    const result = await service.createLeaveAllocation(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listLeaveAllocations = async (req, res, next) => {
  try {
    const result = await service.listLeaveAllocations(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createLeaveRequest = async (req, res, next) => {
  try {
    const result = await service.createLeaveRequest(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listLeaveRequests = async (req, res, next) => {
  try {
    const result = await service.listLeaveRequests(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const approveLeaveRequest = async (req, res, next) => {
  try {
    const result = await service.approveLeaveRequest(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const rejectLeaveRequest = async (req, res, next) => {
  try {
    const result = await service.rejectLeaveRequest(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listPayHeads = async (req, res, next) => {
  try {
    const result = await service.listPayHeads(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createPayHead = async (req, res, next) => {
  try {
    const result = await service.createPayHead(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listSalaryTemplates = async (req, res, next) => {
  try {
    const result = await service.listSalaryTemplates(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createSalaryTemplate = async (req, res, next) => {
  try {
    const result = await service.createSalaryTemplate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createSalaryStructure = async (req, res, next) => {
  try {
    const result = await service.createSalaryStructure(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const processPayroll = async (req, res, next) => {
  try {
    const result = await service.processPayroll(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const bulkProcessPayroll = async (req, res, next) => {
  try {
    const result = await service.bulkProcessPayroll(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listPayrollRecords = async (req, res, next) => {
  try {
    const result = await service.listPayrollRecords(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createEmployeeTicket = async (req, res, next) => {
  try {
    const result = await service.createEmployeeTicket(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listEmployeeTickets = async (req, res, next) => {
  try {
    const result = await service.listEmployeeTickets(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const addTicketMessage = async (req, res, next) => {
  try {
    const result = await service.addTicketMessage(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const bulkUpdate = async (req, res, next) => {
  try {
    const result = await service.bulkUpdate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const exportEmployees = async (req, res, next) => {
  try {
    const result = await service.exportEmployees(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};
