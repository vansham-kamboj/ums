import { Router } from 'express';
import * as ctrl from './inventory.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('inventory:read'), ctrl.list);
router.post('/', authorize('inventory:create'), ctrl.create);
router.get('/:id', authorize('inventory:read'), ctrl.getById);
router.put('/:id', authorize('inventory:update'), ctrl.update);
router.delete('/:id', authorize('inventory:delete'), ctrl.remove);




// Module-specific routes
router.post('/items/:id/copies', authorize('inventory:create'), ctrl.addStockItemCopy);
router.post('/purchases', authorize('inventory:create'), ctrl.createStockPurchase);
router.post('/requisitions', authorize('inventory:create'), ctrl.createStockRequisition);
router.put('/requisitions/:id/approve', authorize('inventory:update'), ctrl.approveRequisition);
router.post('/transfers', authorize('inventory:create'), ctrl.createStockTransfer);
router.post('/adjustments', authorize('inventory:create'), ctrl.createStockAdjustment);
router.get('/balances', authorize('inventory:read'), ctrl.getStockBalances);
router.post('/import', authorize('inventory:create'), ctrl.importStockItems);




export default router;
