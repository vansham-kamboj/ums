import prisma from '../../config/database.js';
import { Prisma } from '@prisma/client';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/apiResponse.js';
import { getPagination } from '../../utils/pagination.js';

const hasField = (modelName, fieldName) => {
  const modelMeta = Prisma.dmmf.datamodel.models.find(m => m.name === modelName);
  return modelMeta?.fields.some(f => f.name === fieldName);
};

const getPrismaModel = (modelName) => {
  if (!modelName) return null;
  const clientName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  return prisma[clientName];
};

export const list = async (req, res, next) => {
  try {
    const { modelName } = req;
    const model = getPrismaModel(modelName);
    if (!model) return next();

    const pagination = getPagination(req.query);
    
    let where = {};
    if (req.teamId && hasField(modelName, 'teamId')) {
      where.teamId = req.teamId;
    }

    if (req.query.search && hasField(modelName, 'name')) {
      where.OR = [
        { name: { contains: req.query.search, mode: 'insensitive' } },
      ];
    }

    const data = await model.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: hasField(modelName, 'createdAt') ? { createdAt: 'desc' } : undefined
    });

    const total = await model.count({ where });

    return paginatedResponse(res, 'Records retrieved', data, { ...pagination, total });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { modelName } = req;
    const model = getPrismaModel(modelName);
    if (!model) return next();

    let where = { id: req.params.id };
    if (req.teamId && hasField(modelName, 'teamId')) {
      where.teamId = req.teamId;
    }

    const item = await model.findFirst({ where });
    if (!item) return errorResponse(res, 'Record not found', 404);
    
    return successResponse(res, 'Record retrieved', item);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { modelName } = req;
    const model = getPrismaModel(modelName);
    if (!model) return next();

    const payload = { ...req.body };
    if (req.teamId && hasField(modelName, 'teamId')) {
      payload.teamId = req.teamId;
    }

    Object.keys(payload).forEach(key => {
      if (payload[key] === '') payload[key] = null;
      if (payload[key] === 'true') payload[key] = true;
      if (payload[key] === 'false') payload[key] = false;
    });

    const item = await model.create({ data: payload });
    return successResponse(res, 'Record created', item, 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { modelName } = req;
    const model = getPrismaModel(modelName);
    if (!model) return next();

    let where = { id: req.params.id };
    if (req.teamId && hasField(modelName, 'teamId')) {
      where.teamId = req.teamId;
    }

    const existing = await model.findFirst({ where });
    if (!existing) return errorResponse(res, 'Record not found', 404);

    const payload = { ...req.body };
    delete payload.id;
    delete payload.teamId;
    
    Object.keys(payload).forEach(key => {
      if (payload[key] === '') payload[key] = null;
      if (payload[key] === 'true') payload[key] = true;
      if (payload[key] === 'false') payload[key] = false;
    });

    const item = await model.update({ where, data: payload });
    return successResponse(res, 'Record updated', item);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { modelName } = req;
    const model = getPrismaModel(modelName);
    if (!model) return next();

    let where = { id: req.params.id };
    if (req.teamId && hasField(modelName, 'teamId')) {
      where.teamId = req.teamId;
    }

    const existing = await model.findFirst({ where });
    if (!existing) return errorResponse(res, 'Record not found', 404);

    await model.delete({ where });
    return successResponse(res, 'Record deleted');
  } catch (error) {
    next(error);
  }
};
