import { Router } from 'express';
import * as ctrl from './notification.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);


// CRUD routes
router.get('/', authorize('notification:read'), ctrl.list);
router.post('/', authorize('notification:create'), ctrl.create);
router.get('/:id', authorize('notification:read'), ctrl.getById);
router.put('/:id', authorize('notification:update'), ctrl.update);
router.delete('/:id', authorize('notification:delete'), ctrl.remove);




// Module-specific routes
router.get('/', ctrl.listNotifications);
router.put('/:id/read', ctrl.markAsRead);
router.put('/read-all', ctrl.markAllAsRead);
router.get('/unread-count', ctrl.getUnreadCount);
router.post('/push/register-device', ctrl.registerDevice);

// Reminders
router.get('/reminders', ctrl.listReminders);
router.post('/reminders', ctrl.createReminder);
router.put('/reminders/:id', ctrl.updateReminder);
router.delete('/reminders/:id', ctrl.deleteReminder);




export default router;
