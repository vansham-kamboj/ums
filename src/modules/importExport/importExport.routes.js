import { Router } from 'express';
import * as ctrl from './importExport.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();




router.use(authenticate);
router.use(requireTeam);


// Module-specific routes

router.post('/import/:type', authorize('import:create'), ctrl.handleImport);
router.get('/import/jobs', authorize('import:read'), ctrl.listImportJobs);
router.delete('/import/students/rollback', authorize('import:delete'), ctrl.rollbackStudentImport);
router.get('/export/:type', authorize('export:read'), ctrl.handleExport);
router.get('/export/jobs', authorize('export:read'), ctrl.listExportJobs);



export default router;
