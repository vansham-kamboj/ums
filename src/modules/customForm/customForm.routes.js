import { Router } from 'express';
import * as ctrl from './customForm.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('customForm:read'), ctrl.list);
router.post('/', authorize('customForm:create'), ctrl.create);
router.get('/:id', authorize('customForm:read'), ctrl.getById);
router.put('/:id', authorize('customForm:update'), ctrl.update);
router.delete('/:id', authorize('customForm:delete'), ctrl.remove);




// Module-specific routes
router.post('/:id/fields', authorize('form:create'), ctrl.addFormField);
router.put('/fields/:fieldId', authorize('form:update'), ctrl.updateFormField);
router.delete('/fields/:fieldId', authorize('form:delete'), ctrl.deleteFormField);
router.post('/:id/submit', ctrl.submitForm);
router.get('/:id/submissions', authorize('form:read'), ctrl.listSubmissions);




export default router;
