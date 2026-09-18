import { Router } from 'express';
import * as ctrl from './config.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();
router.use(authenticate);

// General settings
router.get('/general', authorize('config:read'), ctrl.getGeneralConfig);
router.put('/general', authorize('config:update'), ctrl.updateGeneralConfig);

// Modules
router.get('/modules', authorize('config:read'), ctrl.getModuleConfigs);
router.put('/modules', authorize('config:update'), ctrl.updateTeamModuleConfig);
router.get('/modules/prerequisites', authorize('config:read'), ctrl.checkPrerequisites);

// Mail/SMS/WhatsApp config
router.get('/mail', authorize('config:read'), ctrl.getMailConfig);
router.put('/mail', authorize('config:update'), ctrl.updateMailConfig);
router.post('/mail/test', authorize('config:update'), ctrl.testMailConfig);
router.get('/sms', authorize('config:read'), ctrl.getSmsConfig);
router.put('/sms', authorize('config:update'), ctrl.updateSmsConfig);
router.post('/sms/test', authorize('config:update'), ctrl.testSmsConfig);
router.get('/whatsapp', authorize('config:read'), ctrl.getWhatsappConfig);
router.put('/whatsapp', authorize('config:update'), ctrl.updateWhatsappConfig);
router.post('/whatsapp/test', authorize('config:update'), ctrl.testWhatsappConfig);

// Locales
router.get('/locales', ctrl.listLocales);
router.post('/locales', authorize('config:update'), ctrl.createLocale);
router.put('/locales/:id', authorize('config:update'), ctrl.updateLocale);
router.delete('/locales/:id', authorize('config:delete'), ctrl.deleteLocale);
router.post('/locales/sync', authorize('config:update'), ctrl.syncLocale);

// Custom fields
router.get('/custom-fields', authorize('config:read'), ctrl.listCustomFields);
router.post('/custom-fields', authorize('config:create'), ctrl.createCustomField);
router.put('/custom-fields/:id', authorize('config:update'), ctrl.updateCustomField);
router.delete('/custom-fields/:id', authorize('config:delete'), ctrl.deleteCustomField);

// Options (62+ configurable types)
router.get('/options', authorize('config:read'), ctrl.listOptions);
router.get('/options/:type', authorize('config:read'), ctrl.getOptionByType);
router.post('/options', authorize('config:create'), ctrl.createOption);
router.put('/options/:id', authorize('config:update'), ctrl.updateOption);
router.delete('/options/:id', authorize('config:delete'), ctrl.deleteOption);
router.get('/options/:id/items', authorize('config:read'), ctrl.listOptionItems);
router.post('/options/:id/items', authorize('config:create'), ctrl.createOptionItem);
router.put('/options/items/:itemId', authorize('config:update'), ctrl.updateOptionItem);
router.delete('/options/items/:itemId', authorize('config:delete'), ctrl.deleteOptionItem);
router.put('/options/:id/reorder', authorize('config:update'), ctrl.reorderOptionItems);
router.post('/options/import', authorize('config:create'), ctrl.importOptions);
router.get('/options-export/all', authorize('config:read'), ctrl.exportOptions);

// Assets
router.post('/assets', authorize('config:update'), ctrl.uploadAsset);

export default router;