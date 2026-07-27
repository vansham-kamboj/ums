import prisma from '../../config/database.js';
import { buildSearchFilter } from '../../utils/pagination.js';
import { generateExcel } from '../../services/excel.service.js';
import { generateSlug } from '../../utils/slug.js';
import bcrypt from 'bcryptjs';



// ==================== User ====================

export const listUsers = async (teamId, query = {}, pagination = {}) => {
  const where = {
    ...(teamId ? { teams: { some: { teamId } } } : {}),
    ...buildSearchFilter(query.search, ['name', 'email', 'firstName', 'lastName']),
  };
  const [data, total] = await Promise.all([
    prisma.user.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.user.count({ where }),
  ]);
  return { data, total };
};

export const getUser = async (id, teamId) => {
  return prisma.user.findFirst({ where: { id, ...(teamId ? { teams: { some: { teamId } } } : {}) } });
};

export const createUser = async (data, teamId, userId) => {
  return prisma.user.create({
    data: { 
      ...data,
      password: await bcrypt.hash(data.password, 12),
      teams: teamId ? { create: { teamId, isDefault: true } } : undefined
    },
  });
};

export const updateUser = async (id, data, teamId) => {
  return prisma.user.update({ where: { id }, data });
};

export const deleteUser = async (id, teamId) => {
  return prisma.user.delete({ where: { id } });
};

// ==================== Role ====================

export const listRoles = async (teamId, query = {}, pagination = {}) => {
  const where = {
    
    ...buildSearchFilter(query.search, ['name']),
  };
  const [data, total] = await Promise.all([
    prisma.role.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.role.count({ where }),
  ]);
  return { data, total };
};

export const getRole = async (id, teamId) => {
  return prisma.role.findFirst({ where: { id } });
};

export const createRole = async (data, teamId, userId) => {
  return prisma.role.create({
    data: { ...data,  slug: generateSlug(data.name),  },
  });
};

export const updateRole = async (id, data, teamId) => {
  return prisma.role.update({ where: { id }, data });
};

export const deleteRole = async (id, teamId) => {
  return prisma.role.delete({ where: { id } });
};

// ==================== Permission ====================

export const listPermissions = async (teamId, query = {}, pagination = {}) => {
  const where = {
    
    ...buildSearchFilter(query.search, ['name']),
  };
  const [data, total] = await Promise.all([
    prisma.permission.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.permission.count({ where }),
  ]);
  return { data, total };
};

export const getPermission = async (id, teamId) => {
  return prisma.permission.findFirst({ where: { id } });
};

export const createPermission = async (data, teamId, userId) => {
  return prisma.permission.create({
    data: { ...data,    },
  });
};

export const updatePermission = async (id, data, teamId) => {
  return prisma.permission.update({ where: { id }, data });
};

export const deletePermission = async (id, teamId) => {
  return prisma.permission.delete({ where: { id } });
};


// ==================== User Extended ====================

export const searchUsers = async (query) => {
  return prisma.user.findMany({
    where: buildSearchFilter(query.q, ['email', 'firstName', 'lastName', 'phone']),
    select: { id: true, email: true, firstName: true, lastName: true, scope: true, status: true },
    take: 20,
  });
};

export const exportUsers = async (query) => {
  const users = await prisma.user.findMany({
    select: { email: true, firstName: true, lastName: true, phone: true, scope: true, status: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return generateExcel({
    sheetName: 'Users',
    headers: ['Email', 'First Name', 'Last Name', 'Phone', 'Scope', 'Status', 'Created At'],
    rows: users.map(u => [u.email, u.firstName, u.lastName, u.phone, u.scope, u.status, u.createdAt]),
  });
};

export const updateUserStatus = async (id, status) => {
  return prisma.user.update({ where: { id }, data: { status } });
};

export const updateUserScope = async (id, scope) => {
  return prisma.user.update({ where: { id }, data: { scope } });
};

export const forceChangePassword = async (id) => {
  return prisma.user.update({ where: { id }, data: { forcePasswordChange: true } });
};

export const setUserPermissions = async (userId, permissions) => {
  await prisma.userPermission.deleteMany({ where: { userId } });
  if (permissions && permissions.length > 0) {
    await prisma.userPermission.createMany({
      data: permissions.map(p => ({ userId, permissionId: p.permissionId, granted: p.granted ?? true })),
    });
  }
};

export const setRolePermissions = async (roleId, permissionIds) => {
  await prisma.rolePermission.deleteMany({ where: { roleId } });
  if (permissionIds && permissionIds.length > 0) {
    await prisma.rolePermission.createMany({
      data: permissionIds.map(permissionId => ({ roleId, permissionId })),
    });
  }
};

export const exportRoles = async () => {
  const roles = await prisma.role.findMany({
    include: { permissions: { include: { permission: true } } },
  });
  return generateExcel({
    sheetName: 'Roles',
    headers: ['Name', 'Slug', 'Description', 'Permissions'],
    rows: roles.map(r => [r.name, r.slug, r.description, r.permissions.map(p => p.permission.slug).join(', ')]),
  });
};

export const importRoles = async (data) => {
  const results = [];
  for (const roleData of data.roles || []) {
    const role = await prisma.role.upsert({
      where: { slug: generateSlug(roleData.name) },
      create: { name: roleData.name, slug: generateSlug(roleData.name), description: roleData.description },
      update: { name: roleData.name, description: roleData.description },
    });
    results.push(role);
  }
  return results;
};



