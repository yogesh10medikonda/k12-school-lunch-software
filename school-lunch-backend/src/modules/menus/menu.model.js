import mongoose from 'mongoose';

export const INGREDIENT_MODEL = 'Ingredient';
export const FOOD_ITEM_MODEL = 'FoodItem';
export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Snack'];
export const MENU_STATUSES = ['Draft', 'Published', 'Completed'];

const ingredientLineSchema = new mongoose.Schema(
  {
    ingredient: { type: mongoose.Schema.Types.ObjectId, ref: INGREDIENT_MODEL, required: true },
    quantityPerServing: { type: Number, required: true, min: 0.0001 },
    unit: { type: String, required: true, trim: true, maxlength: 20 },
  },
  { _id: false }
);

const menuItemSchema = new mongoose.Schema(
  {
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: FOOD_ITEM_MODEL, required: true },
    servingSize: { type: Number, required: true, min: 0.0001 },
    ingredients: { type: [ingredientLineSchema], default: [] },
  },
  { _id: false }
);

const menuSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    mealType: { type: String, required: true, enum: MEAL_TYPES },
    expectedServings: { type: Number, required: true, min: 1 },
    status: { type: String, enum: MENU_STATUSES, default: 'Draft' },
    items: { type: [menuItemSchema], default: [] },
  },
  { timestamps: true }
);

menuSchema.index({ date: 1, mealType: 1 });

export default mongoose.model('Menu', menuSchema);