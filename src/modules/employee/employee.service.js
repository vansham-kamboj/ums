import prisma from '../../config/database.js';
import { buildSearchFilter } from '../../utils/pagination.js';
import { generateExcel } from '../../services/excel.service.js';
import bcrypt from 'bcrypt';


// ==================== Standard CRUD ====================

export const list = async (teamId, query = {}, pagination = {}) => {
  const where = {
    ...(teamId ? { teamId } : {}),
    ...buildSearchFilter(query.search, ['name', 'title']),
  };
  const [data, total] = await Promise.all([
    prisma.employee.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.employee.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.employee.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  const payload = { ...data, teamId };
  if (payload.gender) payload.gender = payload.gender.toUpperCase();
  
  return prisma.$transaction(async (tx) => {
    let newUserId = null;
    
    // Auto-provision user account if email is provided
    if (payload.email) {
      // Check if user already exists
      const existingUser = await tx.user.findUnique({ where: { email: payload.email } });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash('Welcome123!', 10);
        const user = await tx.user.create({
          data: {
            email: payload.email,
            password: hashedPassword,
            firstName: payload.firstName,
            lastName: payload.lastName || '',
            scope: 'EMPLOYEE',
            forcePasswordChange: true,
            teams: {
              create: {
                teamId,
                isDefault: true
              }
            }
          }
        });
        newUserId = user.id;
      } else {
        newUserId = existingUser.id;
        // Ensure they have access to this team
        await tx.userTeam.upsert({
          where: { userId_teamId: { userId: newUserId, teamId } },
          update: {},
          create: { userId: newUserId, teamId, isDefault: true }
        });
      }
    }

    return tx.employee.create({ 
      data: {
        ...payload,
        userId: newUserId
      } 
    });
  });
};

export const update = async (id, data, teamId) => {
  const payload = { ...data };
  if (payload.gender) payload.gender = payload.gender.toUpperCase();
  return prisma.employee.update({ where: { id }, data: payload });
};

export const remove = async (id, teamId) => {
  return prisma.employee.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const listDesignations = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listDesignations
  // TODO: Add specific business logic
  return { message: 'listDesignations executed', params, body: Object.keys(body) };
};

export const createDesignation = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createDesignation
  // TODO: Add specific business logic
  return { message: 'createDesignation executed', params, body: Object.keys(body) };
};

export const updateDesignation = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for updateDesignation
  // TODO: Add specific business logic
  return { message: 'updateDesignation executed', params, body: Object.keys(body) };
};

export const deleteDesignation = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for deleteDesignation
  // TODO: Add specific business logic
  return { message: 'deleteDesignation executed', params, body: Object.keys(body) };
};

export const getEmployeeDocuments = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getEmployeeDocuments
  // TODO: Add specific business logic
  return { message: 'getEmployeeDocuments executed', params, body: Object.keys(body) };
};

export const addEmployeeDocument = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addEmployeeDocument
  // TODO: Add specific business logic
  return { message: 'addEmployeeDocument executed', params, body: Object.keys(body) };
};

export const getEmployeeQualifications = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getEmployeeQualifications
  // TODO: Add specific business logic
  return { message: 'getEmployeeQualifications executed', params, body: Object.keys(body) };
};

export const addEmployeeQualification = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addEmployeeQualification
  // TODO: Add specific business logic
  return { message: 'addEmployeeQualification executed', params, body: Object.keys(body) };
};

export const getEmployeeExperience = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getEmployeeExperience
  // TODO: Add specific business logic
  return { message: 'getEmployeeExperience executed', params, body: Object.keys(body) };
};

export const addEmployeeExperience = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addEmployeeExperience
  // TODO: Add specific business logic
  return { message: 'addEmployeeExperience executed', params, body: Object.keys(body) };
};

export const markAttendance = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for markAttendance
  // TODO: Add specific business logic
  return { message: 'markAttendance executed', params, body: Object.keys(body) };
};

export const getAttendanceRecords = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getAttendanceRecords
  // TODO: Add specific business logic
  return { message: 'getAttendanceRecords executed', params, body: Object.keys(body) };
};

export const getAttendanceSummary = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getAttendanceSummary
  // TODO: Add specific business logic
  return { message: 'getAttendanceSummary executed', params, body: Object.keys(body) };
};

export const listWorkShifts = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listWorkShifts
  // TODO: Add specific business logic
  return { message: 'listWorkShifts executed', params, body: Object.keys(body) };
};

export const createWorkShift = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createWorkShift
  // TODO: Add specific business logic
  return { message: 'createWorkShift executed', params, body: Object.keys(body) };
};

export const assignWorkShift = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for assignWorkShift
  // TODO: Add specific business logic
  return { message: 'assignWorkShift executed', params, body: Object.keys(body) };
};

export const createTimesheet = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createTimesheet
  // TODO: Add specific business logic
  return { message: 'createTimesheet executed', params, body: Object.keys(body) };
};

export const listTimesheets = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listTimesheets
  // TODO: Add specific business logic
  return { message: 'listTimesheets executed', params, body: Object.keys(body) };
};

export const listLeaveTypes = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listLeaveTypes
  // TODO: Add specific business logic
  return { message: 'listLeaveTypes executed', params, body: Object.keys(body) };
};

export const createLeaveType = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createLeaveType
  // TODO: Add specific business logic
  return { message: 'createLeaveType executed', params, body: Object.keys(body) };
};

export const createLeaveAllocation = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createLeaveAllocation
  // TODO: Add specific business logic
  return { message: 'createLeaveAllocation executed', params, body: Object.keys(body) };
};

export const listLeaveAllocations = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listLeaveAllocations
  // TODO: Add specific business logic
  return { message: 'listLeaveAllocations executed', params, body: Object.keys(body) };
};

export const createLeaveRequest = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createLeaveRequest
  // TODO: Add specific business logic
  return { message: 'createLeaveRequest executed', params, body: Object.keys(body) };
};

export const listLeaveRequests = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listLeaveRequests
  // TODO: Add specific business logic
  return { message: 'listLeaveRequests executed', params, body: Object.keys(body) };
};

export const approveLeaveRequest = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for approveLeaveRequest
  // TODO: Add specific business logic
  return { message: 'approveLeaveRequest executed', params, body: Object.keys(body) };
};

export const rejectLeaveRequest = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for rejectLeaveRequest
  // TODO: Add specific business logic
  return { message: 'rejectLeaveRequest executed', params, body: Object.keys(body) };
};

export const listPayHeads = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listPayHeads
  // TODO: Add specific business logic
  return { message: 'listPayHeads executed', params, body: Object.keys(body) };
};

export const createPayHead = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createPayHead
  // TODO: Add specific business logic
  return { message: 'createPayHead executed', params, body: Object.keys(body) };
};

export const listSalaryTemplates = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listSalaryTemplates
  // TODO: Add specific business logic
  return { message: 'listSalaryTemplates executed', params, body: Object.keys(body) };
};

export const createSalaryTemplate = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createSalaryTemplate
  // TODO: Add specific business logic
  return { message: 'createSalaryTemplate executed', params, body: Object.keys(body) };
};

export const createSalaryStructure = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createSalaryStructure
  // TODO: Add specific business logic
  return { message: 'createSalaryStructure executed', params, body: Object.keys(body) };
};

export const processPayroll = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for processPayroll
  // TODO: Add specific business logic
  return { message: 'processPayroll executed', params, body: Object.keys(body) };
};

export const bulkProcessPayroll = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for bulkProcessPayroll
  // TODO: Add specific business logic
  return { message: 'bulkProcessPayroll executed', params, body: Object.keys(body) };
};

export const listPayrollRecords = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listPayrollRecords
  // TODO: Add specific business logic
  return { message: 'listPayrollRecords executed', params, body: Object.keys(body) };
};

export const createEmployeeTicket = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createEmployeeTicket
  // TODO: Add specific business logic
  return { message: 'createEmployeeTicket executed', params, body: Object.keys(body) };
};

export const listEmployeeTickets = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listEmployeeTickets
  // TODO: Add specific business logic
  return { message: 'listEmployeeTickets executed', params, body: Object.keys(body) };
};

export const addTicketMessage = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addTicketMessage
  // TODO: Add specific business logic
  return { message: 'addTicketMessage executed', params, body: Object.keys(body) };
};

export const bulkUpdate = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for bulkUpdate
  // TODO: Add specific business logic
  return { message: 'bulkUpdate executed', params, body: Object.keys(body) };
};

export const exportEmployees = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for exportEmployees
  // TODO: Add specific business logic
  return { message: 'exportEmployees executed', params, body: Object.keys(body) };
};
