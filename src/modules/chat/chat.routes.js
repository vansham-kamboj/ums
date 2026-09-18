import { Router } from 'express';
import * as ctrl from './chat.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('chat:read'), ctrl.list);
router.post('/', authorize('chat:create'), ctrl.create);
router.get('/:id', authorize('chat:read'), ctrl.getById);
router.put('/:id', authorize('chat:update'), ctrl.update);
router.delete('/:id', authorize('chat:delete'), ctrl.remove);




// Module-specific routes
router.get('/:id/messages', ctrl.listMessages);
router.post('/:id/messages', ctrl.sendMessage);
router.put('/messages/:messageId/read', ctrl.markMessageRead);
router.get('/users/search', ctrl.searchChatUsers);




export default router;
