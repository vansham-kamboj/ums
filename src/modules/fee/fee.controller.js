import * as service from './fee.service.js';
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

export const addFeeStructureComponent = async (req, res, next) => {
  try {
    const result = await service.addFeeStructureComponent(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const addFeeInstallment = async (req, res, next) => {
  try {
    const result = await service.addFeeInstallment(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const addFeeConcessionRecord = async (req, res, next) => {
  try {
    const result = await service.addFeeConcessionRecord(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getMyFees = async (req, res, next) => {
  try {
    const result = await service.getMyFees(req.user.id);
    return successResponse(res, 'Fees retrieved', result);
  } catch (error) { next(error); }
};

export const allocateStudentFee = async (req, res, next) => {
  try {
    const result = await service.allocateStudentFee(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const processPayment = async (req, res, next) => {
  try {
    const result = await service.processPayment(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listPayments = async (req, res, next) => {
  try {
    const result = await service.listPayments(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const processRefund = async (req, res, next) => {
  try {
    const result = await service.processRefund(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listRefunds = async (req, res, next) => {
  try {
    const result = await service.listRefunds(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const detectMissingFees = async (req, res, next) => {
  try {
    const result = await service.detectMissingFees(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const detectMismatches = async (req, res, next) => {
  try {
    const result = await service.detectMismatches(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const importCustomFees = async (req, res, next) => {
  try {
    const result = await service.importCustomFees(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listLedgerTypes = async (req, res, next) => {
  try {
    const result = await service.listLedgerTypes(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createLedgerType = async (req, res, next) => {
  try {
    const result = await service.createLedgerType(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listLedgers = async (req, res, next) => {
  try {
    const result = await service.listLedgers(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createLedger = async (req, res, next) => {
  try {
    const result = await service.createLedger(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listPaymentMethods = async (req, res, next) => {
  try {
    const result = await service.listPaymentMethods(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createPaymentMethod = async (req, res, next) => {
  try {
    const result = await service.createPaymentMethod(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const listTransactions = async (req, res, next) => {
  try {
    const result = await service.listTransactions(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const createTransaction = async (req, res, next) => {
  try {
    const result = await service.createTransaction(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getTransaction = async (req, res, next) => {
  try {
    const result = await service.getTransaction(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const importTransactions = async (req, res, next) => {
  try {
    const result = await service.importTransactions(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const closeDailyCollection = async (req, res, next) => {
  try {
    const result = await service.closeDailyCollection(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getDayClosure = async (req, res, next) => {
  try {
    const result = await service.getDayClosure(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getDayBook = async (req, res, next) => {
  try {
    const result = await service.getDayBook(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getFeeSummary = async (req, res, next) => {
  try {
    const result = await service.getFeeSummary(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getHeadWiseSummary = async (req, res, next) => {
  try {
    const result = await service.getHeadWiseSummary(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const getConcessionSummary = async (req, res, next) => {
  try {
    const result = await service.getConcessionSummary(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};

export const exportFeeReport = async (req, res, next) => {
  try {
    const result = await service.exportFeeReport(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};
