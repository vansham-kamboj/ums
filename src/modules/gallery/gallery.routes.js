import { Router } from 'express';
import * as ctrl from './gallery.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();
const publicRouter = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('gallery:read'), ctrl.list);
router.post('/', authorize('gallery:create'), ctrl.create);
router.get('/:id', authorize('gallery:read'), ctrl.getById);
router.put('/:id', authorize('gallery:update'), ctrl.update);
router.delete('/:id', authorize('gallery:delete'), ctrl.remove);




// Module-specific routes
router.post('/:id/images', authorize('gallery:create'), ctrl.addGalleryImage);
router.delete('/images/:imageId', authorize('gallery:delete'), ctrl.deleteGalleryImage);


// Public routes (no auth)
publicRouter.get('/', ctrl.listPublicGalleries);
publicRouter.get('/:id', ctrl.getPublicGallery);

router.use('/public', publicRouter);

export default router;
