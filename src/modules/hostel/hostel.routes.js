import { Router } from 'express';
import * as ctrl from './hostel.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('hostel:read'), ctrl.list);
router.post('/', authorize('hostel:create'), ctrl.create);
router.get('/:id', authorize('hostel:read'), ctrl.getById);
router.put('/:id', authorize('hostel:update'), ctrl.update);
router.delete('/:id', authorize('hostel:delete'), ctrl.remove);




// Module-specific routes
router.post('/rooms/:id/allocate', authorize('hostel:create'), ctrl.allocateRoom);
router.delete('/rooms/:id/deallocate/:allocationId', authorize('hostel:delete'), ctrl.deallocateRoom);
router.get('/availability', authorize('hostel:read'), ctrl.getRoomAvailability);




export default router;
