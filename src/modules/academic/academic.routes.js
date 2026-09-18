import { Router } from 'express';
import * as ctrl from './academic.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('academic:read'), ctrl.list);
router.post('/', authorize('academic:create'), ctrl.create);
router.get('/:id', authorize('academic:read'), ctrl.getById);
router.put('/:id', authorize('academic:update'), ctrl.update);
router.delete('/:id', authorize('academic:delete'), ctrl.remove);




// Module-specific routes
router.put('/sessions/:id/archive', authorize('academic:update'), ctrl.archiveSession);
router.put('/sessions/:id/unarchive', authorize('academic:update'), ctrl.unarchiveSession);
router.post('/courses/import', authorize('academic:create'), ctrl.importCourses);
router.post('/subjects/:id/incharge', authorize('academic:update'), ctrl.assignSubjectIncharge);
router.post('/subjects/:id/students', authorize('academic:update'), ctrl.mapStudentsToSubject);




export default router;
