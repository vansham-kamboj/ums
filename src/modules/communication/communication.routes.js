import { Router } from 'express';
import * as ctrl from './communication.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('communication:read'), ctrl.list);
router.post('/', authorize('communication:create'), ctrl.create);
router.get('/:id', authorize('communication:read'), ctrl.getById);
router.put('/:id', authorize('communication:update'), ctrl.update);
router.delete('/:id', authorize('communication:delete'), ctrl.remove);




// Module-specific routes
router.post('/send', authorize('communication:create'), ctrl.sendCommunication);
router.get('/records', authorize('communication:read'), ctrl.listCommunicationRecords);

// Templates
router.get('/templates/mail', authorize('communication:read'), ctrl.listMailTemplates);
router.post('/templates/mail', authorize('communication:create'), ctrl.createMailTemplate);
router.put('/templates/mail/:id', authorize('communication:update'), ctrl.updateMailTemplate);
router.delete('/templates/mail/:id', authorize('communication:delete'), ctrl.deleteMailTemplate);
router.get('/templates/sms', authorize('communication:read'), ctrl.listSmsTemplates);
router.post('/templates/sms', authorize('communication:create'), ctrl.createSmsTemplate);
router.put('/templates/sms/:id', authorize('communication:update'), ctrl.updateSmsTemplate);
router.delete('/templates/sms/:id', authorize('communication:delete'), ctrl.deleteSmsTemplate);
router.get('/templates/whatsapp', authorize('communication:read'), ctrl.listWhatsappTemplates);
router.post('/templates/whatsapp', authorize('communication:create'), ctrl.createWhatsappTemplate);
router.put('/templates/whatsapp/:id', authorize('communication:update'), ctrl.updateWhatsappTemplate);
router.delete('/templates/whatsapp/:id', authorize('communication:delete'), ctrl.deleteWhatsappTemplate);
router.get('/templates/push', authorize('communication:read'), ctrl.listPushTemplates);
router.post('/templates/push', authorize('communication:create'), ctrl.createPushTemplate);
router.put('/templates/push/:id', authorize('communication:update'), ctrl.updatePushTemplate);
router.delete('/templates/push/:id', authorize('communication:delete'), ctrl.deletePushTemplate);




export default router;
