import { Router } from 'express';
import * as ctrl from './website.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();
const publicRouter = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('website:read'), ctrl.list);
router.post('/', authorize('website:create'), ctrl.create);
router.get('/:id', authorize('website:read'), ctrl.getById);
router.put('/:id', authorize('website:update'), ctrl.update);
router.delete('/:id', authorize('website:delete'), ctrl.remove);




// Module-specific routes
router.get('/config', authorize('website:read'), ctrl.getWebsiteConfig);
router.put('/config', authorize('website:update'), ctrl.updateWebsiteConfig);
router.post('/pages/:id/blocks', authorize('website:create'), ctrl.addSiteBlock);
router.put('/blocks/:blockId', authorize('website:update'), ctrl.updateSiteBlock);
router.delete('/blocks/:blockId', authorize('website:delete'), ctrl.deleteSiteBlock);


// Public routes (no auth)
publicRouter.get('/pages/:slug', ctrl.getPublicPage);

router.use('/public', publicRouter);

export default router;
