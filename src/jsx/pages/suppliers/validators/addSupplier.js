import * as yup from "yup";

export const addSupplierSchema = yup.object().shape({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  contact: yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().optional(),
    representative: yup.string().optional(),
  }),
  address: yup.object().shape({
    street: yup.string().optional(),
    city: yup.string().optional(),
    state: yup.string().optional(),
    postalCode: yup.string().optional(),
    country: yup.string().required("Country is required"),
  }),
  contract: yup.object().shape({
    startDate: yup.date().required("Start date is required").typeError("Invalid date"),
    endDate: yup.date().nullable().optional(),
    terms: yup.string().required("Contract terms are required"),
    minimumOrder: yup.number().min(0, "Minimum order cannot be negative").optional(),
    specialConditions: yup.string().optional(),
  }),
  status: yup
    .string()
    .oneOf(["active", "pending", "suspended", "inactive"], "Invalid status")
    .required("Status is required"),
  payment: yup.object().shape({
    currency: yup.string().required("Currency is required"),
    preferredMethod: yup.string().required("Payment method is required"),
    accountDetails: yup.string().optional(),
  }),
  restaurantId: yup.string().optional(),
  notes: yup.string().optional(),
});