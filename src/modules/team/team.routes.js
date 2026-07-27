import { Router } from 'express';
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

export default router;