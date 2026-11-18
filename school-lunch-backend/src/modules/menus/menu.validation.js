import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// ─── Menu Item Subschemas ──────────────────────────────────────────────────────

const menuItemIngredientSchema = z.object({
  ingredient: z.string().regex(objectIdRegex, 'Invalid ingredient ID format'),
  quantityPerServing: z.number().min(0.01, 'Quantity per serving must be positive'),
  unit: z.string().min(1, 'Unit is required').trim(),
});

const menuItemSchema = z.object({
  foodItem: z.string().regex(objectIdRegex, 'Invalid food item ID format'),
  servingSize: z.number().min(0.01, 'Serving size must be positive'),
  ingredients: z.array(menuItemIngredientSchema).default([]),
});

// ─── Menu CRUD ─────────────────────────────────────────────────────────────────

export const menuCreateBodySchema = z.object({
  date: z.string().min(1, 'Date is required'),
  mealType: z.string().min(1, 'Meal type is required').trim(),
  expectedServings: z.number().min(1, 'Expected servings must be at least 1'),
  status: z.enum(['Draft', 'Published', 'Completed']).default('Draft'),
  items: z.array(menuItemSchema).default([]),
});

export const menuUpdateBodySchema = z
  .object({
    date: z.string().optional(),
    mealType: z.string().min(1).trim().optional(),
    expectedServings: z.number().min(1).optional(),
    status: z.enum(['Draft', 'Published', 'Completed']).optional(),
    items: z.array(menuItemSchema).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const menuIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid menu ID format'),
  }),
});

export const menuListQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    search: z.string().optional(),
    sort: z.string().optional(),
    mealType: z.string().optional(),
    status: z.enum(['Draft', 'Published', 'Completed']).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  }),
});

// ─── Duplicate ──────────────────────────────────────────────────────────────────

export const menuDuplicateBodySchema = z.object({
  date: z.string().min(1, 'Date is required'),
});

// ─── Route-ready wrappers ──────────────────────────────────────────────────────

export const menuCreateSchema = { body: menuCreateBodySchema };
export const menuUpdateSchema = { body: menuUpdateBodySchema };
export const menuDuplicateSchema = { body: menuDuplicateBodySchema };