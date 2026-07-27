import { Router } from 'express';
import * as ctrl from './news.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();
const publicRouter = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('news:read'), ctrl.list);
router.post('/', authorize('news:create'), ctrl.create);
router.get('/:id', authorize('news:read'), ctrl.getById);
router.put('/:id', authorize('news:update'), ctrl.update);
router.delete('/:id', authorize('news:delete'), ctrl.remove);




// Module-specific routes



// Public routes (no auth)
publicRouter.get('/', ctrl.listPublicNews);
publicRouter.get('/:slug', ctrl.getPublicNewsArticle);

router.use('/public', publicRouter);

export default router;
