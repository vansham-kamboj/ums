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
    prisma.academicSession.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.academicSession.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.academicSession.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const create = async (data, teamId, userId) => {
  return prisma.academicSession.create({ data: { ...data, teamId, } });
};

export const update = async (id, data, teamId) => {
  return prisma.academicSession.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.academicSession.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const archiveSession = async (params = {}, body = {}, query = {}, teamId, user) => {
  const { id } = params;
  
  const session = await prisma.academicSession.findFirst({
    where: { id, ...(teamId ? { teamId } : {}) }
  });

  if (!session) throw new Error('Academic session not found');

  return prisma.academicSession.update({
    where: { id },
    data: { isArchived: true }
  });
};

export const unarchiveSession = async (params = {}, body = {}, query = {}, teamId, user) => {
  const { id } = params;
  
  const session = await prisma.academicSession.findFirst({
    where: { id, ...(teamId ? { teamId } : {}) }
  });

  if (!session) throw new Error('Academic session not found');

  return prisma.academicSession.update({
    where: { id },
    data: { isArchived: false }
  });
};

export const importCourses = async (params = {}, body = {}, query = {}, teamId, user) => {
  const { courses } = body; // Expects an array of course objects
  if (!courses || !Array.isArray(courses)) {
    throw new Error('Courses array is required');
  }

  const results = [];
  for (const courseData of courses) {
    const { programId, name, code, shortName, description, isActive, position } = courseData;
    
    // Check if program exists
    const program = await prisma.program.findFirst({
      where: { id: programId, ...(teamId ? { teamId } : {}) }
    });

    if (!program) continue;

    const course = await prisma.course.create({
      data: {
        teamId,
        programId,
        name,
        code,
        shortName,
        description,
        isActive: isActive !== undefined ? isActive : true,
        position: position || 0
      }
    });
    results.push(course);
  }

  return { importedCount: results.length, courses: results };
};

export const assignSubjectIncharge = async (params = {}, body = {}, query = {}, teamId, user) => {
  const { id: subjectRecordId } = params;
  const { employeeId, startDate, endDate } = body;
  
  if (!employeeId) throw new Error('employeeId is required');

  const subjectRecord = await prisma.subjectRecord.findUnique({
    where: { id: subjectRecordId },
    include: { subject: true }
  });

  if (!subjectRecord) throw new Error('Subject record not found');

  const employee = await prisma.employee.findFirst({
    where: { id: employeeId, ...(teamId ? { teamId } : {}) }
  });

  if (!employee) throw new Error('Employee not found');

  return prisma.subjectIncharge.create({
    data: {
      subjectRecordId,
      subjectId: subjectRecord.subjectId,
      employeeId,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
    }
  });
};

export const mapStudentsToSubject = async (params = {}, body = {}, query = {}, teamId, user) => {
  const { id: subjectRecordId } = params;
  const { studentRecordIds } = body;

  if (!studentRecordIds || !Array.isArray(studentRecordIds)) {
    throw new Error('studentRecordIds array is required');
  }

  const subjectRecord = await prisma.subjectRecord.findUnique({
    where: { id: subjectRecordId }
  });

  if (!subjectRecord) throw new Error('Subject record not found');

  const mappings = [];
  for (const studentRecordId of studentRecordIds) {
    const existing = await prisma.studentSubject.findUnique({
      where: {
        studentRecordId_subjectRecordId: {
          studentRecordId,
          subjectRecordId
        }
      }
    });

    if (!existing) {
      mappings.push({
        studentRecordId,
        subjectRecordId
      });
    }
  }

  if (mappings.length > 0) {
    await prisma.studentSubject.createMany({
      data: mappings
    });
  }

  return { mappedCount: mappings.length };
};
