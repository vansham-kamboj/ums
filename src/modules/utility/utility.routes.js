import { Router } from 'express';
import * as ctrl from './utility.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('utility:read'), ctrl.list);
router.post('/', authorize('utility:create'), ctrl.create);
router.get('/:id', authorize('utility:read'), ctrl.getById);
router.put('/:id', authorize('utility:update'), ctrl.update);
router.delete('/:id', authorize('utility:delete'), ctrl.remove);




// Module-specific routes
// Todo operations
router.post('/todos/:id/items', ctrl.addTodoItem);
router.put('/todos/items/:itemId/toggle', ctrl.toggleTodoItem);
router.put('/todos/:id/archive', ctrl.archiveTodo);
router.put('/todos/:id/unarchive', ctrl.unarchiveTodo);
router.put('/todos/:id/reorder', ctrl.reorderTodoItems);
router.get('/todos/export', ctrl.exportTodos);

// Backups
router.post('/backups', authorize('utility:create'), ctrl.createBackup);
router.get('/backups', authorize('utility:read'), ctrl.listBackups);
router.delete('/backups/:id', authorize('utility:delete'), ctrl.deleteBackup);

// Activity logs
router.get('/activity-logs', authorize('utility:read'), ctrl.listActivityLogs);
router.get('/activity-logs/export', authorize('utility:export'), ctrl.exportActivityLogs);

// Server logs
router.get('/server-logs', authorize('utility:read'), ctrl.getServerLogs);




export default router;
