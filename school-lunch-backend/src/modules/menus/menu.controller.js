import { asyncHandler } from '../../middleware/asyncHandler.js';
import { apiResponse } from '../../utils/apiResponse.js';
import * as menuService from './menu.service.js';

// ─── Menu CRUD ─────────────────────────────────────────────────────────────────

export const createMenu = asyncHandler(async (req, res) => {
  const menu = await menuService.createMenu(req.body);
  return apiResponse(res, 201, {
    success: true,
    data: menu,
    message: 'Menu created successfully',
  });
});

export const listMenus = asyncHandler(async (req, res) => {
  const { data, meta } = await menuService.listMenus(req.validatedQuery ?? req.query);
  return apiResponse(res, 200, {
    success: true,
    data,
    message: 'Menus retrieved successfully',
    meta,
  });
});

export const getMenu = asyncHandler(async (req, res) => {
  const menu = await menuService.getMenuById(req.params.id);
  return apiResponse(res, 200, {
    success: true,
    data: menu,
    message: 'Menu retrieved successfully',
  });
});

export const updateMenu = asyncHandler(async (req, res) => {
  const menu = await menuService.updateMenu(req.params.id, req.body);
  return apiResponse(res, 200, {
    success: true,
    data: menu,
    message: 'Menu updated successfully',
  });
});

export const deleteMenu = asyncHandler(async (req, res) => {
  await menuService.deleteMenu(req.params.id);
  return apiResponse(res, 200, {
    success: true,
    data: null,
    message: 'Menu deleted successfully',
  });
});

// ─── Duplicate ──────────────────────────────────────────────────────────────────

export const duplicateMenu = asyncHandler(async (req, res) => {
  const { date } = req.body;
  const menu = await menuService.duplicateMenu(req.params.id, date);
  return apiResponse(res, 201, {
    success: true,
    data: menu,
    message: 'Menu duplicated successfully',
  });
});