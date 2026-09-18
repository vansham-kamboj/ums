import { Router } from 'express';
import * as ctrl from './blog.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();
const publicRouter = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('blog:read'), ctrl.list);
router.post('/', authorize('blog:create'), ctrl.create);
router.get('/:id', authorize('blog:read'), ctrl.getById);
router.put('/:id', authorize('blog:update'), ctrl.update);
router.delete('/:id', authorize('blog:delete'), ctrl.remove);




// Module-specific routes



// Public routes (no auth)
publicRouter.get('/', ctrl.listPublicBlogs);
publicRouter.get('/:slug', ctrl.getPublicBlog);

router.use('/public', publicRouter);

export default router;
