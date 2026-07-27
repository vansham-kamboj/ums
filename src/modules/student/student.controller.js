import * as service from './student.service.js';
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

export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await service.getMyProfile(req.user.id);
    return successResponse(res, 'Profile retrieved', profile);
  } catch (error) { next(error); }
};

export const listEnquiries = async (req, res, next) => {
  try {
    const result = await service.listEnquiries(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createEnquiry = async (req, res, next) => {
  try {
    const result = await service.createEnquiry(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getEnquiry = async (req, res, next) => {
  try {
    const result = await service.getEnquiry(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const updateEnquiry = async (req, res, next) => {
  try {
    const result = await service.updateEnquiry(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const result = await service.deleteEnquiry(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const addFollowup = async (req, res, next) => {
  try {
    const result = await service.addFollowup(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const convertToRegistration = async (req, res, next) => {
  try {
    const result = await service.convertToRegistration(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const importEnquiries = async (req, res, next) => {
  try {
    const result = await service.importEnquiries(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listRegistrations = async (req, res, next) => {
  try {
    const result = await service.listRegistrations(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createRegistration = async (req, res, next) => {
  try {
    const result = await service.createRegistration(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getRegistration = async (req, res, next) => {
  try {
    const result = await service.getRegistration(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const updateRegistration = async (req, res, next) => {
  try {
    const result = await service.updateRegistration(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const deleteRegistration = async (req, res, next) => {
  try {
    const result = await service.deleteRegistration(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const verifyRegistration = async (req, res, next) => {
  try {
    const result = await service.verifyRegistration(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const convertToAdmission = async (req, res, next) => {
  try {
    const result = await service.convertToAdmission(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getStudentFees = async (req, res, next) => {
  try {
    const result = await service.getStudentFees(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getStudentAttendance = async (req, res, next) => {
  try {
    const result = await service.getStudentAttendance(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getStudentSubjects = async (req, res, next) => {
  try {
    const result = await service.getStudentSubjects(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getStudentExamRecords = async (req, res, next) => {
  try {
    const result = await service.getStudentExamRecords(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getStudentDocuments = async (req, res, next) => {
  try {
    const result = await service.getStudentDocuments(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const addStudentDocument = async (req, res, next) => {
  try {
    const result = await service.addStudentDocument(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getStudentQualifications = async (req, res, next) => {
  try {
    const result = await service.getStudentQualifications(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const addStudentQualification = async (req, res, next) => {
  try {
    const result = await service.addStudentQualification(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getStudentHealthRecords = async (req, res, next) => {
  try {
    const result = await service.getStudentHealthRecords(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const addStudentHealthRecord = async (req, res, next) => {
  try {
    const result = await service.addStudentHealthRecord(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const clockInOut = async (req, res, next) => {
  try {
    const result = await service.clockInOut(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createLeaveRequest = async (req, res, next) => {
  try {
    const result = await service.createLeaveRequest(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createTransferRequest = async (req, res, next) => {
  try {
    const result = await service.createTransferRequest(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const assignMentor = async (req, res, next) => {
  try {
    const result = await service.assignMentor(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const bulkUpdate = async (req, res, next) => {
  try {
    const result = await service.bulkUpdate(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const exportStudents = async (req, res, next) => {
  try {
    const result = await service.exportStudents(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const searchStudents = async (req, res, next) => {
  try {
    const result = await service.searchStudents(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listAlumni = async (req, res, next) => {
  try {
    const result = await service.listAlumni(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createAlumni = async (req, res, next) => {
  try {
    const result = await service.createAlumni(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const updateAlumni = async (req, res, next) => {
  try {
    const result = await service.updateAlumni(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const deleteAlumni = async (req, res, next) => {
  try {
    const result = await service.deleteAlumni(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};
