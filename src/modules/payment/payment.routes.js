import { Router } from 'express';
import * as ctrl from './payment.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();
const publicRouter = Router();


router.use(authenticate);


// CRUD routes
router.get('/', authorize('payment:read'), ctrl.list);
router.post('/', authorize('payment:create'), ctrl.create);
router.get('/:id', authorize('payment:read'), ctrl.getById);
router.put('/:id', authorize('payment:update'), ctrl.update);
router.delete('/:id', authorize('payment:delete'), ctrl.remove);




// Module-specific routes
router.post('/initiate', ctrl.initiatePayment);
router.post('/verify', ctrl.verifyPayment);
router.get('/status/:orderId', ctrl.getPaymentStatus);
router.get('/gateways', ctrl.listActiveGateways);


// Public routes (no auth)
publicRouter.post('/guest', ctrl.guestPayment);
publicRouter.post('/webhook/:gateway', ctrl.handleWebhook);

router.use('/public', publicRouter);

export default router;
