import { Router } from 'express';
import * as ctrl from './onlineExam.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('onlineExam:read'), ctrl.list);
router.post('/', authorize('onlineExam:create'), ctrl.create);
router.get('/:id', authorize('onlineExam:read'), ctrl.getById);
router.put('/:id', authorize('onlineExam:update'), ctrl.update);
router.delete('/:id', authorize('onlineExam:delete'), ctrl.remove);




// Module-specific routes
router.get('/:id/questions', authorize('online-exam:read'), ctrl.listQuestions);
router.post('/:id/questions', authorize('online-exam:create'), ctrl.addQuestion);
router.put('/questions/:questionId', authorize('online-exam:update'), ctrl.updateQuestion);
router.delete('/questions/:questionId', authorize('online-exam:delete'), ctrl.deleteQuestion);
router.post('/:id/submit', ctrl.submitExam);
router.get('/:id/submissions', authorize('online-exam:read'), ctrl.listSubmissions);
router.get('/:id/results', ctrl.getResults);




export default router;
