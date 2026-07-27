import * as service from './config.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/apiResponse.js';
import { getPagination } from '../../utils/pagination.js';

// Generic CRUD handlers — each entity gets list, get, create, update, delete

export const listSystemConfigs = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const result = await service.listSystemConfigs(req.teamId, req.query, pagination);
    return paginatedResponse(res, 'SystemConfigs retrieved', result.data, { ...pagination, total: result.total });
  } catch (error) { next(error); }
};

export const getSystemConfig = async (req, res, next) => {
  try {
    const item = await service.getSystemConfig(req.params.id, req.teamId);
    if (!item) return errorResponse(res, 'SystemConfig not found', 404);
    return successResponse(res, 'SystemConfig retrieved', item);
  } catch (error) { next(error); }
};

export const createSystemConfig = async (req, res, next) => {
  try {
    const item = await service.createSystemConfig(req.body, req.teamId, req.user.id);
    return successResponse(res, 'SystemConfig created', item, 201);
  } catch (error) { next(error); }
};

export const updateSystemConfig = async (req, res, next) => {
  try {
    const item = await service.updateSystemConfig(req.params.id, req.body, req.teamId);
    return successResponse(res, 'SystemConfig updated', item);
  } catch (error) { next(error); }
};

export const deleteSystemConfig = async (req, res, next) => {
  try {
    await service.deleteSystemConfig(req.params.id, req.teamId);
    return successResponse(res, 'SystemConfig deleted');
  } catch (error) { next(error); }
};

export const listModuleConfigs = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const result = await service.listModuleConfigs(req.teamId, req.query, pagination);
    return paginatedResponse(res, 'ModuleConfigs retrieved', result.data, { ...pagination, total: result.total });
  } catch (error) { next(error); }
};

export const getModuleConfig = async (req, res, next) => {
  try {
    const item = await service.getModuleConfig(req.params.id, req.teamId);
    if (!item) return errorResponse(res, 'ModuleConfig not found', 404);
    return successResponse(res, 'ModuleConfig retrieved', item);
  } catch (error) { next(error); }
};

export const createModuleConfig = async (req, res, next) => {
  try {
    const item = await service.createModuleConfig(req.body, req.teamId, req.user.id);
    return successResponse(res, 'ModuleConfig created', item, 201);
  } catch (error) { next(error); }
};

export const updateModuleConfig = async (req, res, next) => {
  try {
    const item = await service.updateModuleConfig(req.params.id, req.body, req.teamId);
    return successResponse(res, 'ModuleConfig updated', item);
  } catch (error) { next(error); }
};

export const deleteModuleConfig = async (req, res, next) => {
  try {
    await service.deleteModuleConfig(req.params.id, req.teamId);
    return successResponse(res, 'ModuleConfig deleted');
  } catch (error) { next(error); }
};

export const listLocales = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const result = await service.listLocales(req.teamId, req.query, pagination);
    return paginatedResponse(res, 'Locales retrieved', result.data, { ...pagination, total: result.total });
  } catch (error) { next(error); }
};

export const getLocale = async (req, res, next) => {
  try {
    const item = await service.getLocale(req.params.id, req.teamId);
    if (!item) return errorResponse(res, 'Locale not found', 404);
    return successResponse(res, 'Locale retrieved', item);
  } catch (error) { next(error); }
};

export const createLocale = async (req, res, next) => {
  try {
    const item = await service.createLocale(req.body, req.teamId, req.user.id);
    return successResponse(res, 'Locale created', item, 201);
  } catch (error) { next(error); }
};

export const updateLocale = async (req, res, next) => {
  try {
    const item = await service.updateLocale(req.params.id, req.body, req.teamId);
    return successResponse(res, 'Locale updated', item);
  } catch (error) { next(error); }
};

export const deleteLocale = async (req, res, next) => {
  try {
    await service.deleteLocale(req.params.id, req.teamId);
    return successResponse(res, 'Locale deleted');
  } catch (error) { next(error); }
};

export const listCustomFields = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const result = await service.listCustomFields(req.teamId, req.query, pagination);
    return paginatedResponse(res, 'CustomFields retrieved', result.data, { ...pagination, total: result.total });
  } catch (error) { next(error); }
};

export const getCustomField = async (req, res, next) => {
  try {
    const item = await service.getCustomField(req.params.id, req.teamId);
    if (!item) return errorResponse(res, 'CustomField not found', 404);
    return successResponse(res, 'CustomField retrieved', item);
  } catch (error) { next(error); }
};

export const createCustomField = async (req, res, next) => {
  try {
    const item = await service.createCustomField(req.body, req.teamId, req.user.id);
    return successResponse(res, 'CustomField created', item, 201);
  } catch (error) { next(error); }
};

export const updateCustomField = async (req, res, next) => {
  try {
    const item = await service.updateCustomField(req.params.id, req.body, req.teamId);
    return successResponse(res, 'CustomField updated', item);
  } catch (error) { next(error); }
};

export const deleteCustomField = async (req, res, next) => {
  try {
    await service.deleteCustomField(req.params.id, req.teamId);
    return successResponse(res, 'CustomField deleted');
  } catch (error) { next(error); }
};

export const listOptions = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const result = await service.listOptions(req.teamId, req.query, pagination);
    return paginatedResponse(res, 'Options retrieved', result.data, { ...pagination, total: result.total });
  } catch (error) { next(error); }
};

export const getOption = async (req, res, next) => {
  try {
    const item = await service.getOption(req.params.id, req.teamId);
    if (!item) return errorResponse(res, 'Option not found', 404);
    return successResponse(res, 'Option retrieved', item);
  } catch (error) { next(error); }
};

export const createOption = async (req, res, next) => {
  try {
    const item = await service.createOption(req.body, req.teamId, req.user.id);
    return successResponse(res, 'Option created', item, 201);
  } catch (error) { next(error); }
};

export const updateOption = async (req, res, next) => {
  try {
    const item = await service.updateOption(req.params.id, req.body, req.teamId);
    return successResponse(res, 'Option updated', item);
  } catch (error) { next(error); }
};

export const deleteOption = async (req, res, next) => {
  try {
    await service.deleteOption(req.params.id, req.teamId);
    return successResponse(res, 'Option deleted');
  } catch (error) { next(error); }
};

// Additional handlers based on module



export const getGeneralConfig = async (req, res, next) => {
  try { return successResponse(res, 'Config retrieved', await service.getGeneralConfig(req.teamId)); }
  catch (error) { next(error); }
};
export const updateGeneralConfig = async (req, res, next) => {
  try { return successResponse(res, 'Config updated', await service.updateGeneralConfig(req.teamId, req.body)); }
  catch (error) { next(error); }
};
export const getModuleConfigs = async (req, res, next) => {
  try { return successResponse(res, 'Module configs retrieved', await service.getModuleConfigs(req.teamId)); }
  catch (error) { next(error); }
};
export const updateTeamModuleConfig = async (req, res, next) => {
  try { return successResponse(res, 'Module config updated', await service.updateTeamModuleConfig(req.teamId, req.body)); }
  catch (error) { next(error); }
};
export const checkPrerequisites = async (req, res, next) => {
  try { return successResponse(res, 'Prerequisites checked', await service.checkPrerequisites(req.teamId)); }
  catch (error) { next(error); }
};
export const getMailConfig = async (req, res, next) => {
  try { return successResponse(res, 'Mail config retrieved', await service.getConfig(req.teamId, 'mail')); }
  catch (error) { next(error); }
};
export const updateMailConfig = async (req, res, next) => {
  try { return successResponse(res, 'Mail config updated', await service.updateConfig(req.teamId, 'mail', req.body)); }
  catch (error) { next(error); }
};
export const testMailConfig = async (req, res, next) => {
  try { return successResponse(res, 'Mail test result', await service.testConfig('mail')); }
  catch (error) { next(error); }
};
export const getSmsConfig = async (req, res, next) => {
  try { return successResponse(res, 'SMS config', await service.getConfig(req.teamId, 'sms')); }
  catch (error) { next(error); }
};
export const updateSmsConfig = async (req, res, next) => {
  try { return successResponse(res, 'SMS config updated', await service.updateConfig(req.teamId, 'sms', req.body)); }
  catch (error) { next(error); }
};
export const testSmsConfig = async (req, res, next) => {
  try { return successResponse(res, 'SMS test result', await service.testConfig('sms')); }
  catch (error) { next(error); }
};
export const getWhatsappConfig = async (req, res, next) => {
  try { return successResponse(res, 'WhatsApp config', await service.getConfig(req.teamId, 'whatsapp')); }
  catch (error) { next(error); }
};
export const updateWhatsappConfig = async (req, res, next) => {
  try { return successResponse(res, 'WhatsApp config updated', await service.updateConfig(req.teamId, 'whatsapp', req.body)); }
  catch (error) { next(error); }
};
export const testWhatsappConfig = async (req, res, next) => {
  try { return successResponse(res, 'WhatsApp test result', await service.testConfig('whatsapp')); }
  catch (error) { next(error); }
};

export const syncLocale = async (req, res, next) => {
  try { return successResponse(res, 'Locale synced', await service.syncLocale(req.params.id)); }
  catch (error) { next(error); }
};

export const getOptionByType = async (req, res, next) => {
  try { return successResponse(res, 'Option retrieved', await service.getOptionByType(req.params.type, req.teamId)); }
  catch (error) { next(error); }
};

export const listOptionItems = async (req, res, next) => {
  try { return successResponse(res, 'Items retrieved', await service.listOptionItems(req.params.id)); }
  catch (error) { next(error); }
};
export const createOptionItem = async (req, res, next) => {
  try { return successResponse(res, 'Item created', await service.createOptionItem(req.params.id, req.body), 201); }
  catch (error) { next(error); }
};
export const updateOptionItem = async (req, res, next) => {
  try { return successResponse(res, 'Item updated', await service.updateOptionItem(req.params.itemId, req.body)); }
  catch (error) { next(error); }
};
export const deleteOptionItem = async (req, res, next) => {
  try { return successResponse(res, 'Item deleted'); await service.deleteOptionItem(req.params.itemId); }
  catch (error) { next(error); }
};
export const reorderOptionItems = async (req, res, next) => {
  try { return successResponse(res, 'Items reordered', await service.reorderOptionItems(req.params.id, req.body.items)); }
  catch (error) { next(error); }
};
export const importOptions = async (req, res, next) => {
  try { return successResponse(res, 'Options imported', await service.importOptions(req.body, req.teamId)); }
  catch (error) { next(error); }
};
export const exportOptions = async (req, res, next) => {
  try {
    const buffer = await service.exportOptions(req.teamId);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=options.xlsx');
    return res.send(buffer);
  } catch (error) { next(error); }
};
export const uploadAsset = async (req, res, next) => {
  try { return successResponse(res, 'Asset uploaded', { path: req.file?.path }); }
  catch (error) { next(error); }
};

