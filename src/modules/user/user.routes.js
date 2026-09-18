import { Router } from 'express';
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

export default router;