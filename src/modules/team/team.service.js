import prisma from '../../config/database.js';
import { buildSearchFilter } from '../../utils/pagination.js';
import { generateExcel } from '../../services/excel.service.js';
import { generateSlug } from '../../utils/slug.js';




// ==================== Organization ====================

export const listOrganizations = async (teamId, query = {}, pagination = {}) => {
  const where = {
    
    ...buildSearchFilter(query.search, ['name']),
  };
  const [data, total] = await Promise.all([
    prisma.organization.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.organization.count({ where }),
  ]);
  return { data, total };
};

export const getOrganization = async (id, teamId) => {
  return prisma.organization.findFirst({ where: { id } });
};

export const createOrganization = async (data, teamId, userId) => {
  return prisma.organization.create({
    data: { ...data,    },
  });
};

export const updateOrganization = async (id, data, teamId) => {
  return prisma.organization.update({ where: { id }, data });
};

export const deleteOrganization = async (id, teamId) => {
  return prisma.organization.delete({ where: { id } });
};

// ==================== Team ====================

export const listTeams = async (teamId, query = {}, pagination = {}) => {
  const where = {
    ...(teamId ? { teamId } : {}),
    ...buildSearchFilter(query.search, ['name']),
  };
  const [data, total] = await Promise.all([
    prisma.team.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.team.count({ where }),
  ]);
  return { data, total };
};

export const getTeam = async (id, teamId) => {
  return prisma.team.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const createTeam = async (data, teamId, userId) => {
  return prisma.team.create({
    data: { ...data, teamId,   },
  });
};

export const updateTeam = async (id, data, teamId) => {
  return prisma.team.update({ where: { id }, data });
};

export const deleteTeam = async (id, teamId) => {
  return prisma.team.delete({ where: { id } });
};



// ==================== Team Extended ====================

export const updateTeamConfig = async (id, config) => {
  return prisma.team.update({ where: { id }, data: { config } });
};

export const switchTeam = async (userId, teamId) => {
  await prisma.userTeam.updateMany({ where: { userId }, data: { isDefault: false } });
  await prisma.userTeam.update({ where: { userId_teamId: { userId, teamId } }, data: { isDefault: true } });
};

export const exportTeams = async () => {
  const teams = await prisma.team.findMany({ include: { organization: true } });
  return generateExcel({
    sheetName: 'Teams',
    headers: ['Name', 'Code', 'Organization', 'Email', 'Phone', 'Active'],
    rows: teams.map(t => [t.name, t.code, t.organization?.name, t.email, t.phone, t.isActive]),
  });
};


