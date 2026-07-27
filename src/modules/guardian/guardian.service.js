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
    prisma.guardian.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.guardian.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.guardian.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
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
            scope: 'GUARDIAN',
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

    return tx.guardian.create({ 
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
  return prisma.guardian.update({ where: { id }, data: payload });
};

export const remove = async (id, teamId) => {
  return prisma.guardian.delete({ where: { id } });
};


// ==================== Module-specific Operations ====================


export const linkStudent = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for linkStudent
  // TODO: Add specific business logic
  return { message: 'linkStudent executed', params, body: Object.keys(body) };
};

export const setPrimary = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for setPrimary
  // TODO: Add specific business logic
  return { message: 'setPrimary executed', params, body: Object.keys(body) };
};

export const importGuardians = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for importGuardians
  // TODO: Add specific business logic
  return { message: 'importGuardians executed', params, body: Object.keys(body) };
};

export const createGuardianAccount = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for createGuardianAccount
  // TODO: Add specific business logic
  return { message: 'createGuardianAccount executed', params, body: Object.keys(body) };
};

export const syncGuardian = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for syncGuardian
  // TODO: Add specific business logic
  return { message: 'syncGuardian executed', params, body: Object.keys(body) };
};

export const exportGuardians = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for exportGuardians
  // TODO: Add specific business logic
  return { message: 'exportGuardians executed', params, body: Object.keys(body) };
};
