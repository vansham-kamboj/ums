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
    prisma.student.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.student.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.student.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

import crypto from 'crypto';

// Helper to generate a random secure password
const generateRandomPassword = (length = 10) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const create = async (data, teamId, userId) => {
  // Extract relation IDs and mismatching fields that don't belong directly on the Student model
  const { courseId, batchId, academicSessionId, status, ...studentData } = data;
  const payload = { ...studentData, teamId };
  if (status) payload.enrollmentStatus = status;
  if (payload.gender) payload.gender = payload.gender.toUpperCase();
  
  return prisma.$transaction(async (tx) => {
    let newUserId = null;
    
    // Auto-provision user account if email is provided
    if (payload.email) {
      // Check if user already exists
      const existingUser = await tx.user.findUnique({ where: { email: payload.email } });
      if (!existingUser) {
        const plainPassword = generateRandomPassword(12);
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        
        const user = await tx.user.create({
          data: {
            email: payload.email,
            password: hashedPassword,
            firstName: payload.firstName,
            lastName: payload.lastName || '',
            scope: 'STUDENT',
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

        // SIMULATE SENDING EMAIL/SMS WITH CREDENTIALS
        console.log(`\n=================================================`);
        console.log(`[SYS-MAIL] STUDENT ACCOUNT AUTO-PROVISIONED`);
        console.log(`To: ${payload.email}`);
        console.log(`Subject: Welcome to the Institution`);
        console.log(`Your credentials:`);
        console.log(`Email: ${payload.email}`);
        console.log(`Password: ${plainPassword}`);
        console.log(`Please change your password upon first login.`);
        console.log(`=================================================\n`);
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

    const student = await tx.student.create({ 
      data: {
        ...payload,
        userId: newUserId
      } 
    });

    // If batchId is provided, we create a StudentRecord
    if (batchId) {
      // Find an active academic session for this team, or fallback to any
      const session = await tx.academicSession.findFirst({
        where: { teamId, status: 'Active' },
        orderBy: { startDate: 'desc' }
      }) || await tx.academicSession.findFirst({
        where: { teamId },
        orderBy: { startDate: 'desc' }
      });

      if (session) {
        await tx.studentRecord.create({
          data: {
            studentId: student.id,
            batchId: batchId,
            academicSessionId: session.id,
            isActive: true
          }
        });
      }
    }

    return student;
  });
};

export const update = async (id, data, teamId) => {
  const { courseId, batchId, academicSessionId, status, ...updateData } = data;
  if (status) updateData.enrollmentStatus = status;
  if (updateData.gender) updateData.gender = updateData.gender.toUpperCase();
  
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.update({ where: { id }, data: updateData });
    
    // If batch is updated, we could update or create a new student record
    if (batchId) {
      const activeRecord = await tx.studentRecord.findFirst({
        where: { studentId: id, isActive: true }
      });
      if (activeRecord && activeRecord.batchId !== batchId) {
        await tx.studentRecord.update({
          where: { id: activeRecord.id },
          data: { batchId }
        });
      } else if (!activeRecord) {
        const session = await tx.academicSession.findFirst({
          where: { teamId, status: 'Active' },
          orderBy: { startDate: 'desc' }
        });
        if (session) {
          await tx.studentRecord.create({
            data: {
              studentId: id,
              batchId,
              academicSessionId: session.id,
              isActive: true
            }
          });
        }
      }
    }
    
    return student;
  });
};


export const remove = async (id, teamId) => {
  return prisma.student.delete({ where: { id } });
};

export const getMyProfile = async (userId) => {
  const student = await prisma.student.findFirst({
    where: { userId },
    include: {
      records: {
        where: { isActive: true },
        include: {
          batch: {
            include: { course: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!student) throw new Error('Student profile not found');

  const activeRecord = student.records?.[0];
  return {
    ...student,
    batch: activeRecord?.batch,
    course: activeRecord?.batch?.course,
    records: undefined,
  };
};


// ==================== Module-specific Operations ====================


const resolveTeamId = async (teamId, user) => {
  if (teamId) return teamId;
  if (user?.teamId) return user.teamId;
  const existingTeam = await prisma.team.findFirst();
  if (existingTeam) return existingTeam.id;

  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({
      data: { name: 'Default Organization', slug: `org-${Date.now()}` }
    });
  }
  const team = await prisma.team.create({
    data: { name: 'Default Institution', organizationId: org.id }
  });
  return team.id;
};

// ==================== Module-specific Operations ====================

export const listEnquiries = async (params = {}, body = {}, query = {}, teamId, user) => {
  const effectiveTeamId = await resolveTeamId(teamId, user);
  return prisma.enquiry.findMany({
    where: { teamId: effectiveTeamId },
    include: {
      records: { include: { course: true } },
      followups: { orderBy: { createdAt: 'desc' } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const createEnquiry = async (params = {}, body = {}, query = {}, teamId, user) => {
  const effectiveTeamId = await resolveTeamId(teamId, user);
  const data = body || {};
  const enquiryNumber = `ENQ-${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;

  return prisma.enquiry.create({
    data: {
      teamId: effectiveTeamId,
      enquiryNumber,
      firstName: data.firstName || 'Unknown',
      lastName: data.lastName || '',
      phone: data.phone || null,
      email: data.email || null,
      source: data.source || 'Walk-in',
      stage: data.stage || 'New',
      remarks: data.remarks || null,
      records: data.courseId ? {
        create: {
          courseId: data.courseId,
          remarks: 'Initial inquiry course'
        }
      } : undefined
    },
    include: {
      records: { include: { course: true } },
      followups: true
    }
  });
};

export const getEnquiry = async (params = {}, body = {}, query = {}, teamId, user) => {
  const { id } = params;
  return prisma.enquiry.findUnique({
    where: { id },
    include: {
      records: { include: { course: true } },
      followups: { orderBy: { createdAt: 'desc' } }
    }
  });
};

export const updateEnquiry = async (params = {}, body = {}, query = {}, teamId, user) => {
  const { id } = params;
  const { courseId, ...updateFields } = body || {};
  return prisma.enquiry.update({
    where: { id },
    data: updateFields,
    include: {
      records: { include: { course: true } },
      followups: { orderBy: { createdAt: 'desc' } }
    }
  });
};

export const deleteEnquiry = async (params = {}, body = {}, query = {}, teamId, user) => {
  const { id } = params;
  await prisma.enquiry.delete({ where: { id } });
  return { message: 'Enquiry deleted successfully' };
};

export const addFollowup = async (params = {}, body = {}, query = {}, teamId, user) => {
  const { id } = params;
  const followup = await prisma.enquiryFollowup.create({
    data: {
      enquiryId: id,
      followupDate: body.followupDate ? new Date(body.followupDate) : new Date(),
      nextFollowup: body.nextFollowup ? new Date(body.nextFollowup) : null,
      status: body.status || 'Completed',
      remarks: body.remarks || ''
    }
  });
  await prisma.enquiry.update({
    where: { id },
    data: { stage: 'Followed Up' }
  });
  return followup;
};

export const convertToRegistration = async (params = {}, body = {}, query = {}, teamId, user) => {
  const { id } = params;
  return prisma.enquiry.update({
    where: { id },
    data: { isConverted: true, stage: 'Converted' }
  });
};

export const importEnquiries = async (params = {}, body = {}, query = {}, teamId, user) => {
  return { message: 'Import enquiries executed' };
};

export const listRegistrations = async (params = {}, body = {}, query = {}, teamId, user) => {
  const effectiveTeamId = await resolveTeamId(teamId, user);
  return prisma.registration.findMany({
    where: { teamId: effectiveTeamId },
    include: {
      guardians: true,
      fees: true,
      documents: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const createRegistration = async (params = {}, body = {}, query = {}, teamId, user) => {
  const effectiveTeamId = await resolveTeamId(teamId, user);
  const data = body || {};
  const registrationNumber = `REG-${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;

  return prisma.registration.create({
    data: {
      teamId: effectiveTeamId,
      registrationNumber,
      firstName: data.firstName || 'Unknown',
      lastName: data.lastName || '',
      email: data.email || null,
      phone: data.phone || null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      gender: data.gender ? data.gender.toUpperCase() : null,
      bloodGroup: data.bloodGroup || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      country: data.country || null,
      zipCode: data.zipCode || null,
      stage: 'Pending',
      remarks: data.remarks || null
    },
    include: {
      guardians: true,
      fees: true,
      documents: true
    }
  });
};

export const getRegistration = async (params = {}, body = {}, query = {}, teamId, user) => {
  const { id } = params;
  return prisma.registration.findUnique({
    where: { id },
    include: { guardians: true, fees: true, documents: true }
  });
};

export const updateRegistration = async (params = {}, body = {}, query = {}, teamId, user) => {
  const { id } = params;
  return prisma.registration.update({
    where: { id },
    data: body || {},
    include: { guardians: true, fees: true, documents: true }
  });
};

export const deleteRegistration = async (params = {}, body = {}, query = {}, teamId, user) => {
  const { id } = params;
  await prisma.registration.delete({ where: { id } });
  return { message: 'Registration deleted successfully' };
};

export const verifyRegistration = async (params = {}, body = {}, query = {}, teamId, user) => {
  const { id } = params;
  return prisma.registration.update({
    where: { id },
    data: { isVerified: true, verifiedAt: new Date(), stage: 'Verified' }
  });
};

export const convertToAdmission = async (params = {}, body = {}, query = {}, teamId, user) => {
  const { id } = params;
  return prisma.registration.update({
    where: { id },
    data: { isConverted: true, stage: 'Admitted' }
  });
};

export const getStudentFees = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getStudentFees
  // TODO: Add specific business logic
  return { message: 'getStudentFees executed', params, body: Object.keys(body) };
};

export const getStudentAttendance = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getStudentAttendance
  // TODO: Add specific business logic
  return { message: 'getStudentAttendance executed', params, body: Object.keys(body) };
};

export const getStudentSubjects = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getStudentSubjects
  // TODO: Add specific business logic
  return { message: 'getStudentSubjects executed', params, body: Object.keys(body) };
};

export const getStudentExamRecords = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getStudentExamRecords
  // TODO: Add specific business logic
  return { message: 'getStudentExamRecords executed', params, body: Object.keys(body) };
};

export const getStudentDocuments = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getStudentDocuments
  // TODO: Add specific business logic
  return { message: 'getStudentDocuments executed', params, body: Object.keys(body) };
};

export const addStudentDocument = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addStudentDocument
  // TODO: Add specific business logic
  return { message: 'addStudentDocument executed', params, body: Object.keys(body) };
};

export const getStudentQualifications = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getStudentQualifications
  // TODO: Add specific business logic
  return { message: 'getStudentQualifications executed', params, body: Object.keys(body) };
};

export const addStudentQualification = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addStudentQualification
  // TODO: Add specific business logic
  return { message: 'addStudentQualification executed', params, body: Object.keys(body) };
};

export const getStudentHealthRecords = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for getStudentHealthRecords
  // TODO: Add specific business logic
  return { message: 'getStudentHealthRecords executed', params, body: Object.keys(body) };
};

export const addStudentHealthRecord = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for addStudentHealthRecord
  // TODO: Add specific business logic
  return { message: 'addStudentHealthRecord executed', params, body: Object.keys(body) };
};

export const clockInOut = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for clockInOut
  // TODO: Add specific business logic
  return { message: 'clockInOut executed', params, body: Object.keys(body) };
};

export const createLeaveRequest = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createLeaveRequest
  // TODO: Add specific business logic
  return { message: 'createLeaveRequest executed', params, body: Object.keys(body) };
};

export const createTransferRequest = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createTransferRequest
  // TODO: Add specific business logic
  return { message: 'createTransferRequest executed', params, body: Object.keys(body) };
};

export const assignMentor = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for assignMentor
  // TODO: Add specific business logic
  return { message: 'assignMentor executed', params, body: Object.keys(body) };
};

export const bulkUpdate = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for bulkUpdate
  // TODO: Add specific business logic
  return { message: 'bulkUpdate executed', params, body: Object.keys(body) };
};

export const exportStudents = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for exportStudents
  // TODO: Add specific business logic
  return { message: 'exportStudents executed', params, body: Object.keys(body) };
};

export const searchStudents = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for searchStudents
  // TODO: Add specific business logic
  return { message: 'searchStudents executed', params, body: Object.keys(body) };
};

export const listAlumni = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for listAlumni
  // TODO: Add specific business logic
  return { message: 'listAlumni executed', params, body: Object.keys(body) };
};

export const createAlumni = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createAlumni
  // TODO: Add specific business logic
  return { message: 'createAlumni executed', params, body: Object.keys(body) };
};

export const updateAlumni = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for updateAlumni
  // TODO: Add specific business logic
  return { message: 'updateAlumni executed', params, body: Object.keys(body) };
};

export const deleteAlumni = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for deleteAlumni
  // TODO: Add specific business logic
  return { message: 'deleteAlumni executed', params, body: Object.keys(body) };
};
