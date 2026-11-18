import mongoose from 'mongoose';
import Menu, { INGREDIENT_MODEL, FOOD_ITEM_MODEL } from './menu.model.js';

const httpError = (status, message) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

async function assertReferencesExist(items = []) {
  const foodIds = [...new Set(items.map((i) => i.foodItem))];
  const ingredientIds = [
    ...new Set(items.flatMap((i) => (i.ingredients ?? []).map((l) => l.ingredient))),
  ];
  if (foodIds.length) {
    const found = await mongoose.model(FOOD_ITEM_MODEL).countDocuments({ _id: { $in: foodIds } });
    if (found !== foodIds.length) throw httpError(400, 'One or more food items do not exist');
  }
  if (ingredientIds.length) {
    const found = await mongoose
      .model(INGREDIENT_MODEL)
      .countDocuments({ _id: { $in: ingredientIds } });
    if (found !== ingredientIds.length) throw httpError(400, 'One or more ingredients do not exist');
  }
}

export const createMenu = async (req, res, next) => {
  try {
    await assertReferencesExist(req.body.items);
    const menu = await Menu.create({ ...req.body, status: 'Draft' });
    res.status(201).json({ success: true, message: 'Menu created successfully', data: menu });
  } catch (err) {
    next(err);
  }
};

export const listMenus = async (req, res, next) => {
  try {
    const q = req.validatedQuery ?? req.query;
    const filter = {};
    if (q.mealType) filter.mealType = q.mealType;
    if (q.status) filter.status = q.status;
    if (q.dateFrom || q.dateTo) {
      filter.date = {};
      if (q.dateFrom) filter.date.$gte = q.dateFrom;
      if (q.dateTo) filter.date.$lte = q.dateTo;
    }
    const [data, total] = await Promise.all([
      Menu.find(filter)
        .sort({ date: -1, mealType: 1 })
        .skip((q.page - 1) * q.limit)
        .limit(q.limit),
      Menu.countDocuments(filter),
    ]);
    res.json({
      success: true,
      message: 'Menus retrieved successfully',
      data,
      meta: { page: q.page, limit: q.limit, total, totalPages: Math.ceil(total / q.limit) },
    });
  } catch (err) {
    next(err);
  }
};

export const getMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findById(req.params.id)
      .populate('items.foodItem', 'name')
      .populate('items.ingredients.ingredient', 'name unit');
    if (!menu) throw httpError(404, 'Menu not found');
    res.json({ success: true, message: 'Menu retrieved successfully', data: menu });
  } catch (err) {
    next(err);
  }
};

export const updateMenu = async (req, res, next) => {
  try {
    if (req.body.items) await assertReferencesExist(req.body.items);
    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    );
    if (!menu) throw httpError(404, 'Menu not found');
    res.json({ success: true, message: 'Menu updated successfully', data: menu });
  } catch (err) {
    next(err);
  }
};

export const deleteMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) throw httpError(404, 'Menu not found');
    res.json({ success: true, message: 'Menu deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const duplicateMenu = async (req, res, next) => {
  try {
    const source = await Menu.findById(req.params.id).lean();
    if (!source) throw httpError(404, 'Menu not found');
    const copy = await Menu.create({
      date: req.body?.date ?? source.date,
      mealType: source.mealType,
      expectedServings: source.expectedServings,
      items: source.items,
      status: 'Draft',
    });
    res.status(201).json({ success: true, message: 'Menu duplicated successfully', data: copy });
  } catch (err) {
    next(err);
  }
};