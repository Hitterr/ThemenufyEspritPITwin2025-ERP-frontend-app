import * as yup from "yup";

export const updatePasswordFormSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .min(3, "Current password must be at least 8 characters")
    .required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "New password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .min(8, "Confirm password must be at least 8 characters")
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});
