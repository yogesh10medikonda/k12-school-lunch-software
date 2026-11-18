import { Menu } from './menu.model.js';
import { getPagination, getMeta } from '../../utils/pagination.js';
import { ApiError } from '../../utils/ApiError.js';

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

function assertValidId(id, label = 'menu') {
  if (!OBJECT_ID_RE.test(id)) {
    throw new ApiError(400, `Invalid ${label} ID format`);
  }
}

// ─── Menu CRUD ─────────────────────────────────────────────────────────────────

export const createMenu = async (data) => {
  // Check for duplicate (same date and mealType)
  const existing = await Menu.findOne({
    date: new Date(data.date),
    mealType: data.mealType,
  }).lean();
  if (existing) {
    throw new ApiError(409, `Menu for ${data.mealType} on ${data.date} already exists`);
  }

  const menu = await Menu.create(data);
  return menu.toObject ? menu.toObject() : menu;
};

export const listMenus = async (query) => {
  const { page, limit, skip } = getPagination(query.page, query.limit);
  const filter = {};

  if (query.mealType) filter.mealType = query.mealType;
  if (query.status) filter.status = query.status;

  // Date range filter
  if (query.dateFrom || query.dateTo) {
    filter.date = {};
    if (query.dateFrom) filter.date.$gte = new Date(query.dateFrom);
    if (query.dateTo) filter.date.$lte = new Date(query.dateTo);
  }

  const sort = {};
  if (query.sort) {
    const field = query.sort.startsWith('-') ? query.sort.slice(1) : query.sort;
    const order = query.sort.startsWith('-') ? -1 : 1;
    sort[field] = order;
  } else {
    sort.date = -1; // Default: most recent first
  }

  const [menus, total] = await Promise.all([
    Menu.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Menu.countDocuments(filter),
  ]);

  return { data: menus, meta: getMeta(page, limit, total) };
};

export const getMenuById = async (id) => {
  assertValidId(id, 'menu');
  const menu = await Menu.findById(id).lean();
  if (!menu) throw new ApiError(404, 'Menu not found');
  return menu;
};

export const updateMenu = async (id, data) => {
  assertValidId(id, 'menu');

  // If date or mealType is being changed, check for duplicates
  if (data.date || data.mealType) {
    const current = await Menu.findById(id).lean();
    if (!current) throw new ApiError(404, 'Menu not found');

    const newDate = data.date ? new Date(data.date) : current.date;
    const newMealType = data.mealType || current.mealType;

    if (newDate.getTime() !== current.date.getTime() || newMealType !== current.mealType) {
      const existing = await Menu.findOne({
        date: newDate,
        mealType: newMealType,
        _id: { $ne: id },
      }).lean();
      if (existing) {
        throw new ApiError(409, `Menu for ${newMealType} on ${newDate.toISOString().split('T')[0]} already exists`);
      }
    }
  }

  const menu = await Menu.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  }).lean();
  if (!menu) throw new ApiError(404, 'Menu not found');
  return menu;
};

export const deleteMenu = async (id) => {
  assertValidId(id, 'menu');
  const menu = await Menu.findByIdAndDelete(id).lean();
  if (!menu) throw new ApiError(404, 'Menu not found');
  return menu;
};

// ─── Duplicate ──────────────────────────────────────────────────────────────────

export const duplicateMenu = async (id, newDate) => {
  assertValidId(id, 'menu');

  const original = await Menu.findById(id).lean();
  if (!original) throw new ApiError(404, 'Menu not found');

  // Check if menu already exists for the new date and mealType
  const existing = await Menu.findOne({
    date: new Date(newDate),
    mealType: original.mealType,
  }).lean();
  if (existing) {
    throw new ApiError(409, `Menu for ${original.mealType} on ${newDate} already exists`);
  }

  const duplicated = await Menu.create({
    ...original,
    _id: undefined, // Let MongoDB generate new _id
    date: new Date(newDate),
    createdAt: undefined,
    updatedAt: undefined,
  });

  return duplicated.toObject ? duplicated.toObject() : duplicated;
};