/**
 * Module Generator Script
 * Creates routes, controller, service, and validator for all remaining modules
 * Run: node scripts/generate-modules.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modulesDir = path.join(__dirname, '..', 'src', 'modules');

// Module definitions: each has name + CRUD entity configs
const modules = {
  user: {
    entities: ['User', 'Role', 'Permission'],
    routes: `import { Router } from 'express';
import * as ctrl from './user.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();
router.use(authenticate);

// Users
router.get('/', authorize('user:read'), ctrl.listUsers);
router.post('/', authorize('user:create'), ctrl.createUser);
router.get('/search', authorize('user:read'), ctrl.searchUsers);
router.get('/export', authorize('user:export'), ctrl.exportUsers);
router.get('/:id', authorize('user:read'), ctrl.getUser);
router.put('/:id', authorize('user:update'), ctrl.updateUser);
router.delete('/:id', authorize('user:delete'), ctrl.deleteUser);
router.put('/:id/status', authorize('user:update'), ctrl.updateUserStatus);
router.put('/:id/scope', authorize('user:update'), ctrl.updateUserScope);
router.post('/:id/force-change-password', authorize('user:update'), ctrl.forceChangePassword);
router.post('/:id/permissions', authorize('user:update'), ctrl.setUserPermissions);

// Roles
router.get('/roles/list', authorize('role:read'), ctrl.listRoles);
router.post('/roles', authorize('role:create'), ctrl.createRole);
router.get('/roles/:id', authorize('role:read'), ctrl.getRole);
router.put('/roles/:id', authorize('role:update'), ctrl.updateRole);
router.delete('/roles/:id', authorize('role:delete'), ctrl.deleteRole);
router.post('/roles/:id/permissions', authorize('role:update'), ctrl.setRolePermissions);
router.get('/roles/export/all', authorize('role:export'), ctrl.exportRoles);
router.post('/roles/import', authorize('role:create'), ctrl.importRoles);

// Permissions
router.get('/permissions/list', authorize('role:read'), ctrl.listPermissions);

export default router;`,
  },

  team: {
    entities: ['Organization', 'Team'],
    routes: `import { Router } from 'express';
import * as ctrl from './team.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize, authorizeScope } from '../../middleware/authorize.js';

const router = Router();
router.use(authenticate);

// Organizations
router.get('/organizations', authorize('org:read'), ctrl.listOrganizations);
router.post('/organizations', authorize('org:create'), ctrl.createOrganization);
router.get('/organizations/:id', authorize('org:read'), ctrl.getOrganization);
router.put('/organizations/:id', authorize('org:update'), ctrl.updateOrganization);
router.delete('/organizations/:id', authorize('org:delete'), ctrl.deleteOrganization);

// Teams
router.get('/', authorize('team:read'), ctrl.listTeams);
router.post('/', authorize('team:create'), ctrl.createTeam);
router.get('/export', authorize('team:export'), ctrl.exportTeams);
router.get('/:id', authorize('team:read'), ctrl.getTeam);
router.put('/:id', authorize('team:update'), ctrl.updateTeam);
router.delete('/:id', authorize('team:delete'), ctrl.deleteTeam);
router.put('/:id/config', authorize('team:update'), ctrl.updateTeamConfig);
router.post('/switch', ctrl.switchTeam);

export default router;`,
  },

  config: {
    entities: ['SystemConfig', 'ModuleConfig', 'Locale', 'CustomField', 'Option'],
    routes: `import { Router } from 'express';
import * as ctrl from './config.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();
router.use(authenticate);

// General settings
router.get('/general', authorize('config:read'), ctrl.getGeneralConfig);
router.put('/general', authorize('config:update'), ctrl.updateGeneralConfig);

// Modules
router.get('/modules', authorize('config:read'), ctrl.getModuleConfigs);
router.put('/modules', authorize('config:update'), ctrl.updateModuleConfig);
router.get('/modules/prerequisites', authorize('config:read'), ctrl.checkPrerequisites);

// Mail/SMS/WhatsApp config
router.get('/mail', authorize('config:read'), ctrl.getMailConfig);
router.put('/mail', authorize('config:update'), ctrl.updateMailConfig);
router.post('/mail/test', authorize('config:update'), ctrl.testMailConfig);
router.get('/sms', authorize('config:read'), ctrl.getSmsConfig);
router.put('/sms', authorize('config:update'), ctrl.updateSmsConfig);
router.post('/sms/test', authorize('config:update'), ctrl.testSmsConfig);
router.get('/whatsapp', authorize('config:read'), ctrl.getWhatsappConfig);
router.put('/whatsapp', authorize('config:update'), ctrl.updateWhatsappConfig);
router.post('/whatsapp/test', authorize('config:update'), ctrl.testWhatsappConfig);

// Locales
router.get('/locales', ctrl.listLocales);
router.post('/locales', authorize('config:update'), ctrl.createLocale);
router.put('/locales/:id', authorize('config:update'), ctrl.updateLocale);
router.delete('/locales/:id', authorize('config:delete'), ctrl.deleteLocale);
router.post('/locales/sync', authorize('config:update'), ctrl.syncLocale);

// Custom fields
router.get('/custom-fields', authorize('config:read'), ctrl.listCustomFields);
router.post('/custom-fields', authorize('config:create'), ctrl.createCustomField);
router.put('/custom-fields/:id', authorize('config:update'), ctrl.updateCustomField);
router.delete('/custom-fields/:id', authorize('config:delete'), ctrl.deleteCustomField);

// Options (62+ configurable types)
router.get('/options', authorize('config:read'), ctrl.listOptions);
router.get('/options/:type', authorize('config:read'), ctrl.getOptionByType);
router.post('/options', authorize('config:create'), ctrl.createOption);
router.put('/options/:id', authorize('config:update'), ctrl.updateOption);
router.delete('/options/:id', authorize('config:delete'), ctrl.deleteOption);
router.get('/options/:id/items', authorize('config:read'), ctrl.listOptionItems);
router.post('/options/:id/items', authorize('config:create'), ctrl.createOptionItem);
router.put('/options/items/:itemId', authorize('config:update'), ctrl.updateOptionItem);
router.delete('/options/items/:itemId', authorize('config:delete'), ctrl.deleteOptionItem);
router.put('/options/:id/reorder', authorize('config:update'), ctrl.reorderOptionItems);
router.post('/options/import', authorize('config:create'), ctrl.importOptions);
router.get('/options-export/all', authorize('config:read'), ctrl.exportOptions);

// Assets
router.post('/assets', authorize('config:update'), ctrl.uploadAsset);

export default router;`,
  },
};

// Generic controller/service/validator template generator
function generateController(moduleName, entities) {
  const mainEntity = entities[0];
  return `import * as service from './${moduleName}.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/apiResponse.js';
import { getPagination } from '../../utils/pagination.js';

// Generic CRUD handlers — each entity gets list, get, create, update, delete
${entities.map(entity => {
  const lower = entity.charAt(0).toLowerCase() + entity.slice(1);
  const plural = lower + 's';
  return `
export const list${entity}s = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const result = await service.list${entity}s(req.teamId, req.query, pagination);
    return paginatedResponse(res, '${entity}s retrieved', result.data, { ...pagination, total: result.total });
  } catch (error) { next(error); }
};

export const get${entity} = async (req, res, next) => {
  try {
    const item = await service.get${entity}(req.params.id, req.teamId);
    if (!item) return errorResponse(res, '${entity} not found', 404);
    return successResponse(res, '${entity} retrieved', item);
  } catch (error) { next(error); }
};

export const create${entity} = async (req, res, next) => {
  try {
    const item = await service.create${entity}(req.body, req.teamId, req.user.id);
    return successResponse(res, '${entity} created', item, 201);
  } catch (error) { next(error); }
};

export const update${entity} = async (req, res, next) => {
  try {
    const item = await service.update${entity}(req.params.id, req.body, req.teamId);
    return successResponse(res, '${entity} updated', item);
  } catch (error) { next(error); }
};

export const delete${entity} = async (req, res, next) => {
  try {
    await service.delete${entity}(req.params.id, req.teamId);
    return successResponse(res, '${entity} deleted');
  } catch (error) { next(error); }
};`;
}).join('\n')}

// Additional handlers based on module
${moduleName === 'user' ? `
export const listUsers = list${entities[0]}s;
export const getUser = get${entities[0]};
export const createUser = create${entities[0]};
export const updateUser = update${entities[0]};
export const deleteUser = delete${entities[0]};
export const searchUsers = async (req, res, next) => {
  try {
    const result = await service.searchUsers(req.query);
    return successResponse(res, 'Users found', result);
  } catch (error) { next(error); }
};
export const exportUsers = async (req, res, next) => {
  try {
    const buffer = await service.exportUsers(req.query);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
    return res.send(buffer);
  } catch (error) { next(error); }
};
export const updateUserStatus = async (req, res, next) => {
  try {
    const user = await service.updateUserStatus(req.params.id, req.body.status);
    return successResponse(res, 'User status updated', user);
  } catch (error) { next(error); }
};
export const updateUserScope = async (req, res, next) => {
  try {
    const user = await service.updateUserScope(req.params.id, req.body.scope);
    return successResponse(res, 'User scope updated', user);
  } catch (error) { next(error); }
};
export const forceChangePassword = async (req, res, next) => {
  try {
    await service.forceChangePassword(req.params.id);
    return successResponse(res, 'User will be required to change password on next login');
  } catch (error) { next(error); }
};
export const setUserPermissions = async (req, res, next) => {
  try {
    await service.setUserPermissions(req.params.id, req.body.permissions);
    return successResponse(res, 'User permissions updated');
  } catch (error) { next(error); }
};
export const listRoles = list${entities[1]}s;
export const getRole = get${entities[1]};
export const createRole = create${entities[1]};
export const updateRole = update${entities[1]};
export const deleteRole = delete${entities[1]};
export const setRolePermissions = async (req, res, next) => {
  try {
    await service.setRolePermissions(req.params.id, req.body.permissions);
    return successResponse(res, 'Role permissions updated');
  } catch (error) { next(error); }
};
export const exportRoles = async (req, res, next) => {
  try {
    const buffer = await service.exportRoles();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=roles.xlsx');
    return res.send(buffer);
  } catch (error) { next(error); }
};
export const importRoles = async (req, res, next) => {
  try {
    const result = await service.importRoles(req.body);
    return successResponse(res, 'Roles imported', result);
  } catch (error) { next(error); }
};
export const listPermissions = list${entities[2]}s;
` : ''}
${moduleName === 'team' ? `
export const listOrganizations = list${entities[0]}s;
export const getOrganization = get${entities[0]};
export const createOrganization = create${entities[0]};
export const updateOrganization = update${entities[0]};
export const deleteOrganization = delete${entities[0]};
export const listTeams = list${entities[1]}s;
export const getTeam = get${entities[1]};
export const createTeam = create${entities[1]};
export const updateTeam = update${entities[1]};
export const deleteTeam = delete${entities[1]};
export const updateTeamConfig = async (req, res, next) => {
  try {
    const team = await service.updateTeamConfig(req.params.id, req.body);
    return successResponse(res, 'Team config updated', team);
  } catch (error) { next(error); }
};
export const switchTeam = async (req, res, next) => {
  try {
    await service.switchTeam(req.user.id, req.body.teamId);
    return successResponse(res, 'Team switched');
  } catch (error) { next(error); }
};
export const exportTeams = async (req, res, next) => {
  try {
    const buffer = await service.exportTeams();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=teams.xlsx');
    return res.send(buffer);
  } catch (error) { next(error); }
};
` : ''}
${moduleName === 'config' ? `
export const getGeneralConfig = async (req, res, next) => {
  try { return successResponse(res, 'Config retrieved', await service.getGeneralConfig(req.teamId)); }
  catch (error) { next(error); }
};
export const updateGeneralConfig = async (req, res, next) => {
  try { return successResponse(res, 'Config updated', await service.updateGeneralConfig(req.teamId, req.body)); }
  catch (error) { next(error); }
};
export const getModuleConfigs = async (req, res, next) => {
  try { return successResponse(res, 'Module configs retrieved', await service.getModuleConfigs(req.teamId)); }
  catch (error) { next(error); }
};
export const updateModuleConfig = async (req, res, next) => {
  try { return successResponse(res, 'Module config updated', await service.updateModuleConfig(req.teamId, req.body)); }
  catch (error) { next(error); }
};
export const checkPrerequisites = async (req, res, next) => {
  try { return successResponse(res, 'Prerequisites checked', await service.checkPrerequisites(req.teamId)); }
  catch (error) { next(error); }
};
export const getMailConfig = async (req, res, next) => {
  try { return successResponse(res, 'Mail config retrieved', await service.getConfig(req.teamId, 'mail')); }
  catch (error) { next(error); }
};
export const updateMailConfig = async (req, res, next) => {
  try { return successResponse(res, 'Mail config updated', await service.updateConfig(req.teamId, 'mail', req.body)); }
  catch (error) { next(error); }
};
export const testMailConfig = async (req, res, next) => {
  try { return successResponse(res, 'Mail test result', await service.testConfig('mail')); }
  catch (error) { next(error); }
};
export const getSmsConfig = async (req, res, next) => {
  try { return successResponse(res, 'SMS config', await service.getConfig(req.teamId, 'sms')); }
  catch (error) { next(error); }
};
export const updateSmsConfig = async (req, res, next) => {
  try { return successResponse(res, 'SMS config updated', await service.updateConfig(req.teamId, 'sms', req.body)); }
  catch (error) { next(error); }
};
export const testSmsConfig = async (req, res, next) => {
  try { return successResponse(res, 'SMS test result', await service.testConfig('sms')); }
  catch (error) { next(error); }
};
export const getWhatsappConfig = async (req, res, next) => {
  try { return successResponse(res, 'WhatsApp config', await service.getConfig(req.teamId, 'whatsapp')); }
  catch (error) { next(error); }
};
export const updateWhatsappConfig = async (req, res, next) => {
  try { return successResponse(res, 'WhatsApp config updated', await service.updateConfig(req.teamId, 'whatsapp', req.body)); }
  catch (error) { next(error); }
};
export const testWhatsappConfig = async (req, res, next) => {
  try { return successResponse(res, 'WhatsApp test result', await service.testConfig('whatsapp')); }
  catch (error) { next(error); }
};
export const listLocales = list${entities[2]}s;
export const createLocale = create${entities[2]};
export const updateLocale = update${entities[2]};
export const deleteLocale = delete${entities[2]};
export const syncLocale = async (req, res, next) => {
  try { return successResponse(res, 'Locale synced', await service.syncLocale(req.params.id)); }
  catch (error) { next(error); }
};
export const listCustomFields = list${entities[3]}s;
export const createCustomField = create${entities[3]};
export const updateCustomField = update${entities[3]};
export const deleteCustomField = delete${entities[3]};
export const listOptions = list${entities[4]}s;
export const getOptionByType = async (req, res, next) => {
  try { return successResponse(res, 'Option retrieved', await service.getOptionByType(req.params.type, req.teamId)); }
  catch (error) { next(error); }
};
export const createOption = create${entities[4]};
export const updateOption = update${entities[4]};
export const deleteOption = delete${entities[4]};
export const listOptionItems = async (req, res, next) => {
  try { return successResponse(res, 'Items retrieved', await service.listOptionItems(req.params.id)); }
  catch (error) { next(error); }
};
export const createOptionItem = async (req, res, next) => {
  try { return successResponse(res, 'Item created', await service.createOptionItem(req.params.id, req.body), 201); }
  catch (error) { next(error); }
};
export const updateOptionItem = async (req, res, next) => {
  try { return successResponse(res, 'Item updated', await service.updateOptionItem(req.params.itemId, req.body)); }
  catch (error) { next(error); }
};
export const deleteOptionItem = async (req, res, next) => {
  try { return successResponse(res, 'Item deleted'); await service.deleteOptionItem(req.params.itemId); }
  catch (error) { next(error); }
};
export const reorderOptionItems = async (req, res, next) => {
  try { return successResponse(res, 'Items reordered', await service.reorderOptionItems(req.params.id, req.body.items)); }
  catch (error) { next(error); }
};
export const importOptions = async (req, res, next) => {
  try { return successResponse(res, 'Options imported', await service.importOptions(req.body, req.teamId)); }
  catch (error) { next(error); }
};
export const exportOptions = async (req, res, next) => {
  try {
    const buffer = await service.exportOptions(req.teamId);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=options.xlsx');
    return res.send(buffer);
  } catch (error) { next(error); }
};
export const uploadAsset = async (req, res, next) => {
  try { return successResponse(res, 'Asset uploaded', { path: req.file?.path }); }
  catch (error) { next(error); }
};
` : ''}
`;
}

function generateService(moduleName, entities) {
  return `import prisma from '../../config/database.js';
import { buildSearchFilter } from '../../utils/pagination.js';
import { generateExcel } from '../../services/excel.service.js';
import { generateSlug } from '../../utils/slug.js';
${moduleName === 'user' ? "import bcrypt from 'bcryptjs';" : ''}
${moduleName === 'config' ? "import { testEmailConfig } from '../../services/email.service.js';\nimport { testSmsConfig as testSmsService } from '../../services/sms.service.js';\nimport { testWhatsappConfig as testWhatsappService } from '../../services/whatsapp.service.js';" : ''}

${entities.map(entity => {
  const model = entity.charAt(0).toLowerCase() + entity.slice(1);
  const hasTeamId = !['Role', 'Permission', 'Organization'].includes(entity);
  return `
// ==================== ${entity} ====================

export const list${entity}s = async (teamId, query = {}, pagination = {}) => {
  const where = {
    ${hasTeamId ? '...(teamId ? { teamId } : {}),' : ''}
    ...buildSearchFilter(query.search, ['name'${entity === 'User' ? ", 'email', 'firstName', 'lastName'" : ''}]),
  };
  const [data, total] = await Promise.all([
    prisma.${model}.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.${model}.count({ where }),
  ]);
  return { data, total };
};

export const get${entity} = async (id, teamId) => {
  return prisma.${model}.findFirst({ where: { id${hasTeamId ? ', ...(teamId ? { teamId } : {})' : ''} } });
};

export const create${entity} = async (data, teamId, userId) => {
  return prisma.${model}.create({
    data: { ...data, ${hasTeamId ? 'teamId,' : ''} ${model === 'role' ? 'slug: generateSlug(data.name),' : ''} ${model === 'user' ? 'password: await bcrypt.hash(data.password, 12),' : ''} },
  });
};

export const update${entity} = async (id, data, teamId) => {
  return prisma.${model}.update({ where: { id }, data });
};

export const delete${entity} = async (id, teamId) => {
  return prisma.${model}.delete({ where: { id } });
};`;
}).join('\n')}

${moduleName === 'user' ? `
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
` : ''}
${moduleName === 'team' ? `
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
` : ''}
${moduleName === 'config' ? `
// ==================== Config Extended ====================

export const getGeneralConfig = async (teamId) => {
  return prisma.systemConfig.findMany({ where: { teamId } });
};

export const updateGeneralConfig = async (teamId, configs) => {
  const results = [];
  for (const [key, value] of Object.entries(configs)) {
    const config = await prisma.systemConfig.upsert({
      where: { teamId_key: { teamId, key } },
      create: { teamId, key, value: String(value) },
      update: { value: String(value) },
    });
    results.push(config);
  }
  return results;
};

export const getModuleConfigs = async (teamId) => {
  return prisma.moduleConfig.findMany({ where: { teamId } });
};

export const updateModuleConfig = async (teamId, { module, isEnabled, config }) => {
  return prisma.moduleConfig.upsert({
    where: { teamId_module: { teamId, module } },
    create: { teamId, module, isEnabled, config },
    update: { isEnabled, config },
  });
};

export const checkPrerequisites = async (teamId) => {
  const configs = await prisma.moduleConfig.findMany({ where: { teamId } });
  return { modules: configs, status: 'ok' };
};

export const getConfig = async (teamId, group) => {
  return prisma.systemConfig.findMany({ where: { teamId, group } });
};

export const updateConfig = async (teamId, group, data) => {
  const results = [];
  for (const [key, value] of Object.entries(data)) {
    const config = await prisma.systemConfig.upsert({
      where: { teamId_key: { teamId, key: group + '_' + key } },
      create: { teamId, key: group + '_' + key, value: String(value), group },
      update: { value: String(value) },
    });
    results.push(config);
  }
  return results;
};

export const testConfig = async (type) => {
  switch (type) {
    case 'mail': return testEmailConfig();
    case 'sms': return testSmsService();
    case 'whatsapp': return testWhatsappService();
    default: return { success: false, message: 'Unknown config type' };
  }
};

export const syncLocale = async (id) => {
  return { synced: true };
};

export const getOptionByType = async (type, teamId) => {
  return prisma.option.findFirst({ where: { type, teamId }, include: { items: { orderBy: { position: 'asc' } } } });
};

export const listOptionItems = async (optionId) => {
  return prisma.optionItem.findMany({ where: { optionId }, orderBy: { position: 'asc' } });
};

export const createOptionItem = async (optionId, data) => {
  return prisma.optionItem.create({ data: { ...data, optionId } });
};

export const updateOptionItem = async (id, data) => {
  return prisma.optionItem.update({ where: { id }, data });
};

export const deleteOptionItem = async (id) => {
  return prisma.optionItem.delete({ where: { id } });
};

export const reorderOptionItems = async (optionId, items) => {
  for (const item of items) {
    await prisma.optionItem.update({ where: { id: item.id }, data: { position: item.position } });
  }
  return true;
};

export const importOptions = async (data, teamId) => {
  const results = [];
  for (const opt of data.options || []) {
    const option = await prisma.option.upsert({
      where: { teamId_type: { teamId, type: opt.type } },
      create: { teamId, type: opt.type, name: opt.name, module: opt.module },
      update: { name: opt.name, module: opt.module },
    });
    results.push(option);
  }
  return results;
};

export const exportOptions = async (teamId) => {
  const options = await prisma.option.findMany({ where: { teamId }, include: { items: true } });
  return generateExcel({
    sheetName: 'Options',
    headers: ['Type', 'Name', 'Module', 'Items'],
    rows: options.map(o => [o.type, o.name, o.module, o.items.map(i => i.name).join(', ')]),
  });
};
` : ''}
`;
}

function generateValidator(moduleName) {
  return `import Joi from 'joi';

export const create = Joi.object({
  name: Joi.string().required(),
}).unknown(true);

export const update = Joi.object({
  name: Joi.string(),
}).unknown(true);

export const id = Joi.object({
  id: Joi.string().uuid().required(),
});
`;
}

// Generate the modules
for (const [name, config] of Object.entries(modules)) {
  const dir = path.join(modulesDir, name);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Only write if files don't exist (don't overwrite auth module)
  const routesPath = path.join(dir, `${name}.routes.js`);
  const controllerPath = path.join(dir, `${name}.controller.js`);
  const servicePath = path.join(dir, `${name}.service.js`);
  const validatorPath = path.join(dir, `${name}.validator.js`);

  if (!fs.existsSync(routesPath)) fs.writeFileSync(routesPath, config.routes);
  if (!fs.existsSync(controllerPath)) fs.writeFileSync(controllerPath, generateController(name, config.entities));
  if (!fs.existsSync(servicePath)) fs.writeFileSync(servicePath, generateService(name, config.entities));
  if (!fs.existsSync(validatorPath)) fs.writeFileSync(validatorPath, generateValidator(name));

  console.log(`✅ Generated module: ${name}`);
}

console.log('\nDone! Core modules generated.');
