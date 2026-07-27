import { Router } from 'express';
import * as ctrl from './recruitment.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();
const publicRouter = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('recruitment:read'), ctrl.list);
router.post('/', authorize('recruitment:create'), ctrl.create);
router.get('/:id', authorize('recruitment:read'), ctrl.getById);
router.put('/:id', authorize('recruitment:update'), ctrl.update);
router.delete('/:id', authorize('recruitment:delete'), ctrl.remove);




// Module-specific routes
router.put('/applications/:id/status', authorize('recruitment:update'), ctrl.updateApplicationStatus);


// Public routes (no auth)
publicRouter.get('/jobs', ctrl.listPublicJobs);
publicRouter.get('/jobs/:id', ctrl.getPublicJob);
publicRouter.post('/jobs/:id/apply', ctrl.applyForJob);

router.use('/public', publicRouter);

export default router;
