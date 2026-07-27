import prisma from '../../config/database.js';
import { buildSearchFilter } from '../../utils/pagination.js';
import { generateExcel } from '../../services/excel.service.js';


// ==================== Standard CRUD ====================

export const list = async (teamId, query = {}, pagination = {}) => {
  const where = {
    ...(teamId ? { teamId } : {}),
    ...buildSearchFilter(query.search, ['name', 'title']),
  };
  const [data, total] = await Promise.all([
    prisma.feeGroup.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.feeGroup.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.feeGroup.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.feeGroup.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.feeGroup.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.feeGroup.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const addFeeStructureComponent = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addFeeStructureComponent
  // TODO: Add specific business logic
  return { message: 'addFeeStructureComponent executed', params, body: Object.keys(body) };
};

export const addFeeInstallment = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addFeeInstallment
  // TODO: Add specific business logic
  return { message: 'addFeeInstallment executed', params, body: Object.keys(body) };
};

export const addFeeConcessionRecord = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addFeeConcessionRecord
  // TODO: Add specific business logic
  return { message: 'addFeeConcessionRecord executed', params, body: Object.keys(body) };
};

export const allocateStudentFee = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for allocateStudentFee
  // TODO: Add specific business logic
  return { message: 'allocateStudentFee executed', params, body: Object.keys(body) };
};

export const getMyFees = async (userId) => {
  const student = await prisma.student.findFirst({ where: { userId } });
  if (!student) throw new Error('Student profile not found');

  const studentFees = await prisma.studentFee.findMany({
    where: { studentId: student.id },
    include: {
      records: {
        include: { feeHead: true }
      },
      payments: true
    }
  });

  let totalDue = 0;
  let totalPaid = 0;
  let balance = 0;
  let installments = [];
  let history = [];

  studentFees.forEach(fee => {
    totalDue += fee.totalAmount;
    totalPaid += fee.paidAmount;
    balance += fee.balanceAmount;

    fee.records.forEach(r => {
      installments.push({
        id: r.id,
        name: r.feeHead?.name || 'Fee Installment',
        amount: r.amount,
        dueDate: r.dueDate,
        status: r.status.toLowerCase()
      });
    });

    fee.payments.forEach(p => {
      history.push({
        date: p.paymentDate,
        amount: p.amount,
        receiptNo: p.receiptNumber,
        method: p.paymentMethod
      });
    });
  });

  return {
    totalDue,
    totalPaid,
    balance,
    installments,
    history
  };
};

export const processPayment = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for processPayment
  // TODO: Add specific business logic
  return { message: 'processPayment executed', params, body: Object.keys(body) };
};

export const listPayments = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listPayments
  // TODO: Add specific business logic
  return { message: 'listPayments executed', params, body: Object.keys(body) };
};

export const processRefund = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for processRefund
  // TODO: Add specific business logic
  return { message: 'processRefund executed', params, body: Object.keys(body) };
};

export const listRefunds = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listRefunds
  // TODO: Add specific business logic
  return { message: 'listRefunds executed', params, body: Object.keys(body) };
};

export const detectMissingFees = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for detectMissingFees
  // TODO: Add specific business logic
  return { message: 'detectMissingFees executed', params, body: Object.keys(body) };
};

export const detectMismatches = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for detectMismatches
  // TODO: Add specific business logic
  return { message: 'detectMismatches executed', params, body: Object.keys(body) };
};

export const importCustomFees = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for importCustomFees
  // TODO: Add specific business logic
  return { message: 'importCustomFees executed', params, body: Object.keys(body) };
};

export const listLedgerTypes = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listLedgerTypes
  // TODO: Add specific business logic
  return { message: 'listLedgerTypes executed', params, body: Object.keys(body) };
};

export const createLedgerType = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createLedgerType
  // TODO: Add specific business logic
  return { message: 'createLedgerType executed', params, body: Object.keys(body) };
};

export const listLedgers = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listLedgers
  // TODO: Add specific business logic
  return { message: 'listLedgers executed', params, body: Object.keys(body) };
};

export const createLedger = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createLedger
  // TODO: Add specific business logic
  return { message: 'createLedger executed', params, body: Object.keys(body) };
};

export const listPaymentMethods = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listPaymentMethods
  // TODO: Add specific business logic
  return { message: 'listPaymentMethods executed', params, body: Object.keys(body) };
};

export const createPaymentMethod = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createPaymentMethod
  // TODO: Add specific business logic
  return { message: 'createPaymentMethod executed', params, body: Object.keys(body) };
};

export const listTransactions = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listTransactions
  // TODO: Add specific business logic
  return { message: 'listTransactions executed', params, body: Object.keys(body) };
};

export const createTransaction = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createTransaction
  // TODO: Add specific business logic
  return { message: 'createTransaction executed', params, body: Object.keys(body) };
};

export const getTransaction = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getTransaction
  // TODO: Add specific business logic
  return { message: 'getTransaction executed', params, body: Object.keys(body) };
};

export const importTransactions = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for importTransactions
  // TODO: Add specific business logic
  return { message: 'importTransactions executed', params, body: Object.keys(body) };
};

export const closeDailyCollection = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for closeDailyCollection
  // TODO: Add specific business logic
  return { message: 'closeDailyCollection executed', params, body: Object.keys(body) };
};

export const getDayClosure = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getDayClosure
  // TODO: Add specific business logic
  return { message: 'getDayClosure executed', params, body: Object.keys(body) };
};

export const getDayBook = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getDayBook
  // TODO: Add specific business logic
  return { message: 'getDayBook executed', params, body: Object.keys(body) };
};

export const getFeeSummary = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getFeeSummary
  // TODO: Add specific business logic
  return { message: 'getFeeSummary executed', params, body: Object.keys(body) };
};

export const getHeadWiseSummary = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getHeadWiseSummary
  // TODO: Add specific business logic
  return { message: 'getHeadWiseSummary executed', params, body: Object.keys(body) };
};

export const getConcessionSummary = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getConcessionSummary
  // TODO: Add specific business logic
  return { message: 'getConcessionSummary executed', params, body: Object.keys(body) };
};

export const exportFeeReport = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for exportFeeReport
  // TODO: Add specific business logic
  return { message: 'exportFeeReport executed', params, body: Object.keys(body) };
};
