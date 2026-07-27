import * as service from './user.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/apiResponse.js';
import { getPagination } from '../../utils/pagination.js';

// Generic CRUD handlers — each entity gets list, get, create, update, delete

export const listUsers = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const result = await service.listUsers(req.teamId, req.query, pagination);
    return paginatedResponse(res, 'Users retrieved', result.data, { ...pagination, total: result.total });
  } catch (error) { next(error); }
};

export const getUser = async (req, res, next) => {
  try {
    const item = await service.getUser(req.params.id, req.teamId);
    if (!item) return errorResponse(res, 'User not found', 404);
    return successResponse(res, 'User retrieved', item);
  } catch (error) { next(error); }
};

export const createUser = async (req, res, next) => {
  try {
    const item = await service.createUser(req.body, req.teamId, req.user.id);
    return successResponse(res, 'User created', item, 201);
  } catch (error) { next(error); }
};

export const updateUser = async (req, res, next) => {
  try {
    const item = await service.updateUser(req.params.id, req.body, req.teamId);
    return successResponse(res, 'User updated', item);
  } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => {
  try {
    await service.deleteUser(req.params.id, req.teamId);
    return successResponse(res, 'User deleted');
  } catch (error) { next(error); }
};

export const listRoles = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const result = await service.listRoles(req.teamId, req.query, pagination);
    return paginatedResponse(res, 'Roles retrieved', result.data, { ...pagination, total: result.total });
  } catch (error) { next(error); }
};

export const getRole = async (req, res, next) => {
  try {
    const item = await service.getRole(req.params.id, req.teamId);
    if (!item) return errorResponse(res, 'Role not found', 404);
    return successResponse(res, 'Role retrieved', item);
  } catch (error) { next(error); }
};

export const createRole = async (req, res, next) => {
  try {
    const item = await service.createRole(req.body, req.teamId, req.user.id);
    return successResponse(res, 'Role created', item, 201);
  } catch (error) { next(error); }
};

export const updateRole = async (req, res, next) => {
  try {
    const item = await service.updateRole(req.params.id, req.body, req.teamId);
    return successResponse(res, 'Role updated', item);
  } catch (error) { next(error); }
};

export const deleteRole = async (req, res, next) => {
  try {
    await service.deleteRole(req.params.id, req.teamId);
    return successResponse(res, 'Role deleted');
  } catch (error) { next(error); }
};

export const listPermissions = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const result = await service.listPermissions(req.teamId, req.query, pagination);
    return paginatedResponse(res, 'Permissions retrieved', result.data, { ...pagination, total: result.total });
  } catch (error) { next(error); }
};

export const getPermission = async (req, res, next) => {
  try {
    const item = await service.getPermission(req.params.id, req.teamId);
    if (!item) return errorResponse(res, 'Permission not found', 404);
    return successResponse(res, 'Permission retrieved', item);
  } catch (error) { next(error); }
};

export const createPermission = async (req, res, next) => {
  try {
    const item = await service.createPermission(req.body, req.teamId, req.user.id);
    return successResponse(res, 'Permission created', item, 201);
  } catch (error) { next(error); }
};

export const updatePermission = async (req, res, next) => {
  try {
    const item = await service.updatePermission(req.params.id, req.body, req.teamId);
    return successResponse(res, 'Permission updated', item);
  } catch (error) { next(error); }
};

export const deletePermission = async (req, res, next) => {
  try {
    await service.deletePermission(req.params.id, req.teamId);
    return successResponse(res, 'Permission deleted');
  } catch (error) { next(error); }
};

// Additional handlers based on module


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




