import * as service from './team.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/apiResponse.js';
import { getPagination } from '../../utils/pagination.js';

// Generic CRUD handlers — each entity gets list, get, create, update, delete

export const listOrganizations = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const result = await service.listOrganizations(req.teamId, req.query, pagination);
    return paginatedResponse(res, 'Organizations retrieved', result.data, { ...pagination, total: result.total });
  } catch (error) { next(error); }
};

export const getOrganization = async (req, res, next) => {
  try {
    const item = await service.getOrganization(req.params.id, req.teamId);
    if (!item) return errorResponse(res, 'Organization not found', 404);
    return successResponse(res, 'Organization retrieved', item);
  } catch (error) { next(error); }
};

export const createOrganization = async (req, res, next) => {
  try {
    const item = await service.createOrganization(req.body, req.teamId, req.user.id);
    return successResponse(res, 'Organization created', item, 201);
  } catch (error) { next(error); }
};

export const updateOrganization = async (req, res, next) => {
  try {
    const item = await service.updateOrganization(req.params.id, req.body, req.teamId);
    return successResponse(res, 'Organization updated', item);
  } catch (error) { next(error); }
};

export const deleteOrganization = async (req, res, next) => {
  try {
    await service.deleteOrganization(req.params.id, req.teamId);
    return successResponse(res, 'Organization deleted');
  } catch (error) { next(error); }
};

export const listTeams = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const result = await service.listTeams(req.teamId, req.query, pagination);
    return paginatedResponse(res, 'Teams retrieved', result.data, { ...pagination, total: result.total });
  } catch (error) { next(error); }
};

export const getTeam = async (req, res, next) => {
  try {
    const item = await service.getTeam(req.params.id, req.teamId);
    if (!item) return errorResponse(res, 'Team not found', 404);
    return successResponse(res, 'Team retrieved', item);
  } catch (error) { next(error); }
};

export const createTeam = async (req, res, next) => {
  try {
    const item = await service.createTeam(req.body, req.teamId, req.user.id);
    return successResponse(res, 'Team created', item, 201);
  } catch (error) { next(error); }
};

export const updateTeam = async (req, res, next) => {
  try {
    const item = await service.updateTeam(req.params.id, req.body, req.teamId);
    return successResponse(res, 'Team updated', item);
  } catch (error) { next(error); }
};

export const deleteTeam = async (req, res, next) => {
  try {
    await service.deleteTeam(req.params.id, req.teamId);
    return successResponse(res, 'Team deleted');
  } catch (error) { next(error); }
};

// Additional handlers based on module



export const updateTeamConfig = async (req, res, next) => {
  try {
    const team = await service.updateTeamConfig(req.params.id, req.body);
    return successResponse(res, 'Team config updated', team);
  } catch (error) { next(error); }
};
export const switchTeam = async (req, res, next) => {
  try {
    await service.switchTeam(req.user.id, req.body.teamId);
    return successResponse(res, 'Team switched');
  } catch (error) { next(error); }
};
export const exportTeams = async (req, res, next) => {
  try {
    const buffer = await service.exportTeams();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=teams.xlsx');
    return res.send(buffer);
  } catch (error) { next(error); }
};


