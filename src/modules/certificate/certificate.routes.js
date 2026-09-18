import { Router } from 'express';
import * as ctrl from './certificate.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();
const publicRouter = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('certificate:read'), ctrl.list);
router.post('/', authorize('certificate:create'), ctrl.create);
router.get('/:id', authorize('certificate:read'), ctrl.getById);
router.put('/:id', authorize('certificate:update'), ctrl.update);
router.delete('/:id', authorize('certificate:delete'), ctrl.remove);




// Module-specific routes
router.post('/generate', authorize('certificate:create'), ctrl.generateCertificate);
router.get('/list', authorize('certificate:read'), ctrl.listCertificates);
router.post('/id-cards/generate', authorize('certificate:create'), ctrl.generateIdCard);
router.get('/id-cards/list', authorize('certificate:read'), ctrl.listIdCards);


// Public routes (no auth)
publicRouter.get('/verify/:number', ctrl.verifyCertificate);

router.use('/public', publicRouter);

export default router;
