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
    prisma.examTerm.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.examTerm.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.examTerm.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.examTerm.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.examTerm.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.examTerm.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const reorderTerms = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for reorderTerms
  // TODO: Add specific business logic
  return { message: 'reorderTerms executed', params, body: Object.keys(body) };
};

export const getMyResults = async (userId) => {
  const student = await prisma.student.findFirst({ where: { userId } });
  if (!student) throw new Error('Student profile not found');

  const records = await prisma.examRecord.findMany({
    where: { studentId: student.id },
    include: {
      examSchedule: {
        include: {
          exam: true
        }
      }
    }
  });

  // Group by Exam
  const examMap = {};
  records.forEach(r => {
    const examId = r.examSchedule.examId;
    if (!examMap[examId]) {
      examMap[examId] = {
        id: r.examSchedule.exam.id,
        name: r.examSchedule.exam.name,
        date: r.examSchedule.date,
        status: r.examSchedule.isLocked ? 'Published' : 'Pending',
        results: []
      };
    }
    examMap[examId].results.push({
      subject: r.examSchedule.subjectName,
      marks: r.marksObtained,
      maxMarks: r.examSchedule.maxMarks,
      grade: r.grade || 'N/A'
    });
  });

  return { exams: Object.values(examMap) };
};

export const reorderExams = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for reorderExams
  // TODO: Add specific business logic
  return { message: 'reorderExams executed', params, body: Object.keys(body) };
};

export const addExamRecords = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addExamRecords
  // TODO: Add specific business logic
  return { message: 'addExamRecords executed', params, body: Object.keys(body) };
};

export const lockExamMarks = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for lockExamMarks
  // TODO: Add specific business logic
  return { message: 'lockExamMarks executed', params, body: Object.keys(body) };
};

export const publishResults = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for publishResults
  // TODO: Add specific business logic
  return { message: 'publishResults executed', params, body: Object.keys(body) };
};

export const getSubjectWiseReport = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getSubjectWiseReport
  // TODO: Add specific business logic
  return { message: 'getSubjectWiseReport executed', params, body: Object.keys(body) };
};

export const getMarksReport = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getMarksReport
  // TODO: Add specific business logic
  return { message: 'getMarksReport executed', params, body: Object.keys(body) };
};

export const createCompetency = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createCompetency
  // TODO: Add specific business logic
  return { message: 'createCompetency executed', params, body: Object.keys(body) };
};

export const listCompetencies = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listCompetencies
  // TODO: Add specific business logic
  return { message: 'listCompetencies executed', params, body: Object.keys(body) };
};

export const createObservation = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createObservation
  // TODO: Add specific business logic
  return { message: 'createObservation executed', params, body: Object.keys(body) };
};

export const listObservations = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listObservations
  // TODO: Add specific business logic
  return { message: 'listObservations executed', params, body: Object.keys(body) };
};
