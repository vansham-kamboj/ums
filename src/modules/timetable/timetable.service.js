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
    prisma.timetable.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.timetable.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.timetable.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.timetable.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.timetable.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.timetable.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const addTimetableRecord = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addTimetableRecord
  // TODO: Add specific business logic
  return { message: 'addTimetableRecord executed', params, body: Object.keys(body) };
};

export const addTimetableAllocation = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addTimetableAllocation
  // TODO: Add specific business logic
  return { message: 'addTimetableAllocation executed', params, body: Object.keys(body) };
};

export const getBatchTimetable = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getBatchTimetable
  // TODO: Add specific business logic
  return { message: 'getBatchTimetable executed', params, body: Object.keys(body) };
};

export const getTeacherTimetable = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getTeacherTimetable
  // TODO: Add specific business logic
  return { message: 'getTeacherTimetable executed', params, body: Object.keys(body) };
};

export const bulkUpdatePeriods = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for bulkUpdatePeriods
  // TODO: Add specific business logic
  return { message: 'bulkUpdatePeriods executed', params, body: Object.keys(body) };
};

export const getMyTimetable = async (userId) => {
  const student = await prisma.student.findFirst({
    where: { userId },
    include: { records: { where: { isActive: true } } }
  });
  if (!student) throw new Error('Student profile not found');

  const activeRecord = student.records[0];
  if (!activeRecord) return { schedule: {} };

  const timetableRecords = await prisma.timetableRecord.findMany({
    where: {
      batchId: activeRecord.batchId,
      timetable: { isActive: true }
    },
    include: { allocations: { orderBy: { position: 'asc' } } }
  });

  const schedule = {};
  
  // Format day enum to Title Case (e.g. MONDAY -> Monday)
  const formatDay = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
  };

  timetableRecords.forEach(tr => {
    const dayName = formatDay(tr.day);
    schedule[dayName] = tr.allocations
      .filter(a => !a.isBreak)
      .map(a => ({
        time: `${a.startTime} - ${a.endTime}`,
        subject: a.subjectName,
        teacher: a.teacherName || 'TBA',
        room: a.room || 'TBA'
      }));
  });

  return { schedule };
};
