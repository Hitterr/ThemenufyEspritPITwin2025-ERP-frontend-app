import * as yup from "yup";
import { addInvoiceItemSchema } from "./addInvoiceItemSchema";

export const addInvoiceSchema = yup.object().shape({
  restaurant: yup.string().required("Restaurant ID is required"),
  supplier: yup.string().required("Supplier ID is required"),
  status: yup
    .string()
    .oneOf(["pending", "paid", "cancelled"])
    .default("pending"),
  items: yup
    .array(addInvoiceItemSchema)
    .min(1, "At least one item is required")
    .required("Items are required"),
});
