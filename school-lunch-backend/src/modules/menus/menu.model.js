import mongoose from 'mongoose';

/**
 * Menu — daily meal plan with items and ingredient requirements.
 */
const menuSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },
    mealType: {
      type: String,
      required: [true, 'Meal type is required'],
      trim: true,
      index: true,
    },
    expectedServings: {
      type: Number,
      required: [true, 'Expected servings is required'],
      min: [1, 'Expected servings must be at least 1'],
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Completed'],
      default: 'Draft',
      index: true,
    },
    items: [
      {
        foodItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'FoodItem',
          required: [true, 'Food item is required'],
        },
        servingSize: {
          type: Number,
          required: [true, 'Serving size is required'],
          min: [0.01, 'Serving size must be positive'],
        },
        ingredients: [
          {
            ingredient: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Ingredient',
              required: [true, 'Ingredient is required'],
            },
            quantityPerServing: {
              type: Number,
              required: [true, 'Quantity per serving is required'],
              min: [0.01, 'Quantity per serving must be positive'],
            },
            unit: {
              type: String,
              required: [true, 'Unit is required'],
              trim: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

menuSchema.index({ date: 1, mealType: 1 });
menuSchema.index({ status: 1 });

export const Menu = mongoose.model('Menu', menuSchema);
export default Menu;