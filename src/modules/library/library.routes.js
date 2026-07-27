import { Router } from 'express';
import * as ctrl from './library.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('library:read'), ctrl.list);
router.post('/', authorize('library:create'), ctrl.create);
router.get('/:id', authorize('library:read'), ctrl.getById);
router.put('/:id', authorize('library:update'), ctrl.update);
router.delete('/:id', authorize('library:delete'), ctrl.remove);




// Module-specific routes
router.post('/:id/copies', authorize('library:create'), ctrl.addBookCopy);
router.post('/:id/additions', authorize('library:create'), ctrl.addBookAddition);
router.post('/issue', authorize('library:create'), ctrl.issueBook);
router.post('/return', authorize('library:create'), ctrl.returnBook);
router.get('/overdue', authorize('library:read'), ctrl.getOverdueBooks);
router.get('/reports', authorize('library:read'), ctrl.getLibraryReports);




export default router;
