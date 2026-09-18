import prisma from '../../config/database.js';
import { buildSearchFilter } from '../../utils/pagination.js';
import { generateExcel } from '../../services/excel.service.js';
import { generateSlug } from '../../utils/slug.js';

import { testEmailConfig } from '../../services/email.service.js';
import { testSmsConfig as testSmsService } from '../../services/sms.service.js';
import { testWhatsappConfig as testWhatsappService } from '../../services/whatsapp.service.js';


// ==================== SystemConfig ====================

export const listSystemConfigs = async (teamId, query = {}, pagination = {}) => {
  const where = {
    ...(teamId ? { teamId } : {}),
    ...buildSearchFilter(query.search, ['name']),
  };
  const [data, total] = await Promise.all([
    prisma.systemConfig.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.systemConfig.count({ where }),
  ]);
  return { data, total };
};

export const getSystemConfig = async (id, teamId) => {
  return prisma.systemConfig.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const createSystemConfig = async (data, teamId, userId) => {
  return prisma.systemConfig.create({
    data: { ...data, teamId,   },
  });
};

export const updateSystemConfig = async (id, data, teamId) => {
  return prisma.systemConfig.update({ where: { id }, data });
};

export const deleteSystemConfig = async (id, teamId) => {
  return prisma.systemConfig.delete({ where: { id } });
};

// ==================== ModuleConfig ====================

export const listModuleConfigs = async (teamId, query = {}, pagination = {}) => {
  const where = {
    ...(teamId ? { teamId } : {}),
    ...buildSearchFilter(query.search, ['name']),
  };
  const [data, total] = await Promise.all([
    prisma.moduleConfig.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.moduleConfig.count({ where }),
  ]);
  return { data, total };
};

export const getModuleConfig = async (id, teamId) => {
  return prisma.moduleConfig.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const createModuleConfig = async (data, teamId, userId) => {
  return prisma.moduleConfig.create({
    data: { ...data, teamId,   },
  });
};

export const updateModuleConfig = async (id, data, teamId) => {
  return prisma.moduleConfig.update({ where: { id }, data });
};

export const deleteModuleConfig = async (id, teamId) => {
  return prisma.moduleConfig.delete({ where: { id } });
};

// ==================== Locale ====================

export const listLocales = async (teamId, query = {}, pagination = {}) => {
  const where = {
    ...(teamId ? { teamId } : {}),
    ...buildSearchFilter(query.search, ['name']),
  };
  const [data, total] = await Promise.all([
    prisma.locale.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.locale.count({ where }),
  ]);
  return { data, total };
};

export const getLocale = async (id, teamId) => {
  return prisma.locale.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const createLocale = async (data, teamId, userId) => {
  return prisma.locale.create({
    data: { ...data, teamId,   },
  });
};

export const updateLocale = async (id, data, teamId) => {
  return prisma.locale.update({ where: { id }, data });
};

export const deleteLocale = async (id, teamId) => {
  return prisma.locale.delete({ where: { id } });
};

// ==================== CustomField ====================

export const listCustomFields = async (teamId, query = {}, pagination = {}) => {
  const where = {
    ...(teamId ? { teamId } : {}),
    ...buildSearchFilter(query.search, ['name']),
  };
  const [data, total] = await Promise.all([
    prisma.customField.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.customField.count({ where }),
  ]);
  return { data, total };
};

export const getCustomField = async (id, teamId) => {
  return prisma.customField.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const createCustomField = async (data, teamId, userId) => {
  return prisma.customField.create({
    data: { ...data, teamId,   },
  });
};

export const updateCustomField = async (id, data, teamId) => {
  return prisma.customField.update({ where: { id }, data });
};

export const deleteCustomField = async (id, teamId) => {
  return prisma.customField.delete({ where: { id } });
};

// ==================== Option ====================

export const listOptions = async (teamId, query = {}, pagination = {}) => {
  const where = {
    ...(teamId ? { teamId } : {}),
    ...buildSearchFilter(query.search, ['name']),
  };
  const [data, total] = await Promise.all([
    prisma.option.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.option.count({ where }),
  ]);
  return { data, total };
};

export const getOption = async (id, teamId) => {
  return prisma.option.findFirst({ where: { id, ...(teamId ? { teamId } : {}) } });
};

export const createOption = async (data, teamId, userId) => {
  return prisma.option.create({
    data: { ...data, teamId,   },
  });
};

export const updateOption = async (id, data, teamId) => {
  return prisma.option.update({ where: { id }, data });
};

export const deleteOption = async (id, teamId) => {
  return prisma.option.delete({ where: { id } });
};




// ==================== Config Extended ====================

export const getGeneralConfig = async (teamId) => {
  return prisma.systemConfig.findMany({ where: { teamId } });
};

export const updateGeneralConfig = async (teamId, configs) => {
  const results = [];
  for (const [key, value] of Object.entries(configs)) {
    const config = await prisma.systemConfig.upsert({
      where: { teamId_key: { teamId, key } },
      create: { teamId, key, value: String(value) },
      update: { value: String(value) },
    });
    results.push(config);
  }
  return results;
};

export const getModuleConfigs = async (teamId) => {
  return prisma.moduleConfig.findMany({ where: { teamId } });
};

export const updateTeamModuleConfig = async (teamId, { module, isEnabled, config }) => {
  return prisma.moduleConfig.upsert({
    where: { teamId_module: { teamId, module } },
    create: { teamId, module, isEnabled, config },
    update: { isEnabled, config },
  });
};

export const checkPrerequisites = async (teamId) => {
  const configs = await prisma.moduleConfig.findMany({ where: { teamId } });
  return { modules: configs, status: 'ok' };
};

export const getConfig = async (teamId, group) => {
  return prisma.systemConfig.findMany({ where: { teamId, group } });
};

export const updateConfig = async (teamId, group, data) => {
  const results = [];
  for (const [key, value] of Object.entries(data)) {
    const config = await prisma.systemConfig.upsert({
      where: { teamId_key: { teamId, key: group + '_' + key } },
      create: { teamId, key: group + '_' + key, value: String(value), group },
      update: { value: String(value) },
    });
    results.push(config);
  }
  return results;
};

export const testConfig = async (type) => {
  switch (type) {
    case 'mail': return testEmailConfig();
    case 'sms': return testSmsService();
    case 'whatsapp': return testWhatsappService();
    default: return { success: false, message: 'Unknown config type' };
  }
};

export const syncLocale = async (id) => {
  return { synced: true };
};

export const getOptionByType = async (type, teamId) => {
  return prisma.option.findFirst({ where: { type, teamId }, include: { items: { orderBy: { position: 'asc' } } } });
};

export const listOptionItems = async (optionId) => {
  return prisma.optionItem.findMany({ where: { optionId }, orderBy: { position: 'asc' } });
};

export const createOptionItem = async (optionId, data) => {
  return prisma.optionItem.create({ data: { ...data, optionId } });
};

export const updateOptionItem = async (id, data) => {
  return prisma.optionItem.update({ where: { id }, data });
};

export const deleteOptionItem = async (id) => {
  return prisma.optionItem.delete({ where: { id } });
};

export const reorderOptionItems = async (optionId, items) => {
  for (const item of items) {
    await prisma.optionItem.update({ where: { id: item.id }, data: { position: item.position } });
  }
  return true;
};

export const importOptions = async (data, teamId) => {
  const results = [];
  for (const opt of data.options || []) {
    const option = await prisma.option.upsert({
      where: { teamId_type: { teamId, type: opt.type } },
      create: { teamId, type: opt.type, name: opt.name, module: opt.module },
      update: { name: opt.name, module: opt.module },
    });
    results.push(option);
  }
  return results;
};

export const exportOptions = async (teamId) => {
  const options = await prisma.option.findMany({ where: { teamId }, include: { items: true } });
  return generateExcel({
    sheetName: 'Options',
    headers: ['Type', 'Name', 'Module', 'Items'],
    rows: options.map(o => [o.type, o.name, o.module, o.items.map(i => i.name).join(', ')]),
  });
};

