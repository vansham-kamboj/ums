import { Router } from 'express';
import * as ctrl from './transport.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('transport:read'), ctrl.list);
router.post('/', authorize('transport:create'), ctrl.create);
router.get('/:id', authorize('transport:read'), ctrl.getById);
router.put('/:id', authorize('transport:update'), ctrl.update);
router.delete('/:id', authorize('transport:delete'), ctrl.remove);




// Module-specific routes
router.post('/routes/:id/stoppages', authorize('transport:create'), ctrl.addRouteStoppage);
router.post('/routes/:id/passengers', authorize('transport:create'), ctrl.addRoutePassenger);
router.post('/routes/:id/fees', authorize('transport:create'), ctrl.addTransportFee);
router.post('/vehicles/:id/documents', authorize('transport:create'), ctrl.addVehicleDocument);
router.post('/vehicles/:id/incharge', authorize('transport:create'), ctrl.assignVehicleIncharge);
router.post('/vehicles/:id/fuel', authorize('transport:create'), ctrl.addFuelRecord);
router.post('/vehicles/:id/service', authorize('transport:create'), ctrl.addServiceRecord);
router.post('/vehicles/:id/trip', authorize('transport:create'), ctrl.addTripRecord);
router.post('/vehicles/:id/case', authorize('transport:create'), ctrl.addCaseRecord);
router.post('/vehicles/:id/expense', authorize('transport:create'), ctrl.addVehicleExpense);
router.post('/stoppages/import', authorize('transport:create'), ctrl.importStoppages);
router.get('/reports', authorize('transport:read'), ctrl.getTransportReports);




export default router;
