import * as yup from "yup";

export const linkIngredientSchema = yup.object().shape({
  ingredientId: yup
    .string()
    .required("Ingredient is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Ingredient ID format"),
  pricePerUnit: yup
    .number()
    .required("Price per unit is required")
    .min(0, "Price cannot be negative")
    .test("decimal", "Price can have max 2 decimal places", (value) =>
      value ? /^\d+(\.\d{0,2})?$/.test(value.toString()) : true
    ),
  leadTimeDays: yup
    .number()
    .required("Lead time is required")
    .min(1, "Lead time must be at least 1 day"),
});