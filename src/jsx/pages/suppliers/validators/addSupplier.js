import * as yup from "yup";

export const addSupplierSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters"),
  contact: yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
      .string()
      .optional()
      .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
      .nullable(),
    representative: yup
      .string()
      .max(100, "Representative name must not exceed 100 characters")
      .optional(),
  }),
  address: yup.object().shape({
    street: yup.string().optional(),
    city: yup.string().optional(),
    state: yup.string().optional(),
    postalCode: yup.string().optional(),
    country: yup.string().default("Canada"),
  }),
  contract: yup.object().shape({
    startDate: yup.date().required("Start date is required"),
    endDate: yup
      .date()
      .nullable()
      .transform((value, originalValue) => (originalValue === "" ? null : value)) // Transform empty string to null
      .test("endDate-after-startDate", "End date must be after start date", function (value) {
        return !value || !this.parent.startDate || value >= this.parent.startDate;
      }),
    terms: yup
      .string()
      .oneOf(["NET_30", "NET_60", "COD", "Custom"], "Invalid terms")
      .default("NET_30"),
    minimumOrder: yup.number().min(0, "Minimum order cannot be negative").nullable(),
    specialConditions: yup.string().optional(),
  }),
  status: yup
    .string()
    .oneOf(["active", "pending", "suspended", "inactive"], "Invalid status")
    .default("active"),
  payment: yup.object().shape({
    currency: yup.string().default("CAD"),
    preferredMethod: yup
      .string()
      .oneOf(["bank", "credit", "cash"], "Invalid payment method")
      .default("bank"),
    accountDetails: yup.string().optional(),
  }),
  restaurantId: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Restaurant ID format")
    .optional(), // Made optional to match backend
  notes: yup.string().optional(),
});