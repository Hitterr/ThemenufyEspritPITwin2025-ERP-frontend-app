import * as yup from "yup";

export const linkStockSchema = yup.object().shape({
  stockId: yup
    .string()
    .required("Stock is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Stock ID format"),
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
