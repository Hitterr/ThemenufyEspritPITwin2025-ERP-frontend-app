import * as yup from "yup";

export const categorySchema = yup
  .object({
    name: yup.string().required("Category name is required"),
    description: yup.string(),
  })
  .required();
