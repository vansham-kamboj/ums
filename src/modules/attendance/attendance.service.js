import prisma from '../../config/database.js';
import { buildSearchFilter } from '../../utils/pagination.js';
import { generateExcel } from '../../services/excel.service.js';


// ==================== Standard CRUD ====================

export const list = async (teamId, query = {}, pagination = {}) => {
  const where = {
    
    ...buildSearchFilter(query.search, ['name', 'title']),
  };
  const [data, total] = await Promise.all([
    prisma.studentAttendance.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.studentAttendance.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.studentAttendance.findFirst({ where: { id } });
};

export const create = async (data, teamId, userId) => {
  return prisma.studentAttendance.create({ data: { ...data,  } });
};

export const update = async (id, data, teamId) => {
  return prisma.studentAttendance.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.studentAttendance.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const markStudentAttendance = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for markStudentAttendance
  // TODO: Add specific business logic
  return { message: 'markStudentAttendance executed', params, body: Object.keys(body) };
};

export const getMyAttendance = async (userId) => {
  const student = await prisma.student.findFirst({ where: { userId } });
  if (!student) throw new Error('Student profile not found');

  const attendances = await prisma.studentAttendance.findMany({
    where: { studentId: student.id },
    orderBy: { date: 'desc' },
  });

  let totalPresent = 0;
  let totalAbsent = 0;

  attendances.forEach(a => {
    const s = a.status.toLowerCase();
    if (s === 'present' || s === 'late') totalPresent++;
    else if (s === 'absent') totalAbsent++;
  });

  const total = totalPresent + totalAbsent;
  const percentage = total > 0 ? Math.round((totalPresent / total) * 100) : 0;

  const recent = attendances.slice(0, 5).map(a => ({
    date: a.date,
    status: a.status.toLowerCase()
  }));

  return {
    percentage,
    totalPresent,
    totalAbsent,
    recent
  };
};

export const markAttendanceByQr = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for markAttendanceByQr
  // TODO: Add specific business logic
  return { message: 'markAttendanceByQr executed', params, body: Object.keys(body) };
};

export const studentClockInOut = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for studentClockInOut
  // TODO: Add specific business logic
  return { message: 'studentClockInOut executed', params, body: Object.keys(body) };
};

export const getStudentAttendanceReport = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getStudentAttendanceReport
  // TODO: Add specific business logic
  return { message: 'getStudentAttendanceReport executed', params, body: Object.keys(body) };
};

export const getSubjectWiseReport = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getSubjectWiseReport
  // TODO: Add specific business logic
  return { message: 'getSubjectWiseReport executed', params, body: Object.keys(body) };
};

export const markEmployeeAttendance = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for markEmployeeAttendance
  // TODO: Add specific business logic
  return { message: 'markEmployeeAttendance executed', params, body: Object.keys(body) };
};

export const getEmployeeAttendanceSummary = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getEmployeeAttendanceSummary
  // TODO: Add specific business logic
  return { message: 'getEmployeeAttendanceSummary executed', params, body: Object.keys(body) };
};

export const getEmployeeAttendanceRecords = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getEmployeeAttendanceRecords
  // TODO: Add specific business logic
  return { message: 'getEmployeeAttendanceRecords executed', params, body: Object.keys(body) };
};
