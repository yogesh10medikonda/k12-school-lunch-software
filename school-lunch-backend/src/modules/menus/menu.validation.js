import { z } from 'zod';
import { MEAL_TYPES, MENU_STATUSES } from './menu.model.js';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const ingredientLine = z.object({
  ingredient: objectId,
  quantityPerServing: z.number().positive(),
  unit: z.string().trim().min(1).max(20),
});

const menuItem = z.object({
  foodItem: objectId,
  servingSize: z.number().positive(),
  ingredients: z.array(ingredientLine).max(50).optional(),
});

const base = z.object({
  date: z.coerce.date(),
  mealType: z.enum(MEAL_TYPES),
  expectedServings: z.number().int().min(1).max(100000),
  items: z.array(menuItem).max(30).optional(),
});

export const idParamSchema = { params: z.object({ id: objectId }) };

export const createMenuSchema = { body: base };

export const updateMenuSchema = {
  params: z.object({ id: objectId }),
  body: base
    .partial()
    .refine((v) => Object.keys(v).length > 0, 'Provide at least one field to update'),
};

export const duplicateMenuSchema = {
  params: z.object({ id: objectId }),
  body: z.object({ date: z.coerce.date().optional() }).optional(),
};

export const listMenuQuerySchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    dateFrom: z.coerce.date().optional(),
    dateTo: z.coerce.date().optional(),
    mealType: z.enum(MEAL_TYPES).optional(),
    status: z.enum(MENU_STATUSES).optional(),
  }),
};