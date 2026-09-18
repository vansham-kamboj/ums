import { Router } from 'express';
import * as ctrl from './socialWall.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('socialWall:read'), ctrl.list);
router.post('/', authorize('socialWall:create'), ctrl.create);
router.get('/:id', authorize('socialWall:read'), ctrl.getById);
router.put('/:id', authorize('socialWall:update'), ctrl.update);
router.delete('/:id', authorize('socialWall:delete'), ctrl.remove);




// Module-specific routes
router.get('/feed', ctrl.getFeed);
router.post('/:id/comments', ctrl.addComment);
router.get('/:id/comments', ctrl.listComments);
router.delete('/comments/:commentId', ctrl.deleteComment);




export default router;
