import * as yup from "yup";
export const addInvoiceItemSchema = yup.object().shape({
  stock: yup.string().required("Stock ID is required"),

  quantity: yup
    .number()
    .positive("Quantity must be positive")
    .required("Quantity is required"),
  price: yup.number().positive("Price must be positive").optional(),
});
