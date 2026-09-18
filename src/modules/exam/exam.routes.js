import { Router } from 'express';
import * as ctrl from './exam.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize, authorizeScope } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('exam:read'), ctrl.list);
router.post('/', authorize('exam:create'), ctrl.create);
router.get('/:id', authorize('exam:read'), ctrl.getById);
router.put('/:id', authorize('exam:update'), ctrl.update);
router.delete('/:id', authorize('exam:delete'), ctrl.remove);




// Module-specific routes
router.get('/my-results', authorizeScope('STUDENT'), ctrl.getMyResults);
router.put('/terms/reorder', authorize('exam:update'), ctrl.reorderTerms);
router.put('/reorder', authorize('exam:update'), ctrl.reorderExams);
router.post('/schedules/:id/records', authorize('exam:create'), ctrl.addExamRecords);
router.post('/schedules/:id/lock', authorize('exam:update'), ctrl.lockExamMarks);
router.post('/results/publish', authorize('exam:update'), ctrl.publishResults);
router.get('/reports/subject-wise', authorize('exam:read'), ctrl.getSubjectWiseReport);
router.get('/reports/marks', authorize('exam:read'), ctrl.getMarksReport);
router.post('/competencies', authorize('exam:create'), ctrl.createCompetency);
router.get('/competencies', authorize('exam:read'), ctrl.listCompetencies);
router.post('/observations', authorize('exam:create'), ctrl.createObservation);
router.get('/observations', authorize('exam:read'), ctrl.listObservations);




export default router;
