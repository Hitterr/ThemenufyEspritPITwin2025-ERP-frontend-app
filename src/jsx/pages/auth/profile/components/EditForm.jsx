import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Col, Row, Stack } from "react-bootstrap";
import { authStore } from "../../../../store/authStore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .strict()
    .trim()
    .matches(/^[A-Za-z]+$/, "First name must contain only letters")
    .min(3, "First name must be at least 3 characters")
    .required("First name is required"),

  lastName: yup
    .string()
    .strict()
    .trim()
    .matches(/^[A-Za-z]+$/, "Last name must contain only letters")
    .min(3, "Last name must be at least 3 characters")
    .required("Last name is required"),

  email: yup
    .string()
    .strict()
    .trim()
    .matches(
      /^[\w-.]+@([\w-]+\.)+(com|tn)$/,
      "Email must be a valid .com or .tn address"
    )
    .required("Email is required"),

  phone: yup
    .string()
    .strict()
    .trim()
    .matches(/^\+?\d{8,15}$/, "Enter a valid phone number")
    .required("Phone number is required"),

  address: yup
    .string()
    .strict()
    .trim()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\s]{5,}$/,
      "Address must contain at least one letter, one number, and be at least 5 characters long"
    )
    .required("Address is required"),

  employee: yup.object({
    salary: yup
      .number()
      .typeError("Salary must be a number")
      .positive("Salary must be positive")
      .integer("Salary must be an integer")
      .required("Salary is required"),
  }),

  restaurant: yup.object({
    name: yup
      .string()
      .strict()
      .trim()
      .matches(/^[A-Za-z\s]+$/, "Restaurant name must contain only letters")
      .min(5, "Restaurant name must be more than 4 characters")
      .required("Restaurant name is required"),
  }),

  image: yup
    .string()
    .strict()
    .trim()
    .url("Image must be a valid URL")
    .required("Image URL is required"),
});

const EditForm = () => {
  const { currentUser, setActiveTab, updateProfile } = authStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...currentUser,
      image: currentUser.image, // Keep the current image in the default values
    },
  });

  const onSubmit = (values) => {
    const updatedProfile = {
      ...values,
      image: currentUser.image, // Preserve the current image
    };
    console.log("Form submitted:", updatedProfile);
    updateProfile(updatedProfile); // Update profile with the image
    Swal.fire({
      icon: "success",
      title: "Good job!",
      text: "Profile Updated",
    });
    setTimeout(() => {
      setActiveTab("About");
    }, 500);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 border rounded shadow bg-white"
    >
      <h3 className="text-primary mb-4">User Info</h3>
      <Row xs={1} sm={2} md={3} className="g-3">
        <Col>
          <label className="form-label">First Name</label>
          <input
            {...register("firstName")}
            style={{ height: "41px" }}
            className="form-control border-primary rounded-3"
          />
          <p className="text-danger">{errors.firstName?.message}</p>
        </Col>
        <Col>
          <label className="form-label">Last Name</label>
          <input
            {...register("lastName")}
            style={{ height: "41px" }}
            className="form-control border-primary rounded-3"
          />
          <p className="text-danger">{errors.lastName?.message}</p>
        </Col>
        <Col>
          <label className="form-label">Email</label>
          <input
            {...register("email")}
            style={{ height: "41px" }}
            className="form-control border-primary rounded-3"
          />
          <p className="text-danger">{errors.email?.message}</p>
        </Col>
        <Col>
          <label className="form-label">Phone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field}
                country={"tn"}
                inputClass="form-control border-primary  rounded-3 w-100"
                containerClass="w-100 h-100  p-0"
                inputStyle={{ height: "41px" }}
                containerStyle={{ height: "41px" }}
                buttonStyle={{ height: "41px" }}
                buttonClass="bg-white border-primary rounded-start-3"
              />
            )}
          />
          <p className="text-danger">{errors.phone?.message}</p>
        </Col>

        <Col>
          <label className="form-label">Address</label>
          <input
            {...register("address")}
            style={{ height: "41px" }}
            className="form-control border-primary rounded-3"
          />
          <p className="text-danger">{errors.address?.message}</p>
        </Col>
      </Row>

      {/* Employee Info */}
      <Stack className="mt-4">
        <h3 className="text-primary mb-3">Employee Info</h3>
        <Row xs={1} sm={2} md={3} className="g-3">
          <Col>
            <label className="form-label">Salary</label>
            <input
              {...register("employee.salary")}
              style={{ height: "41px" }}
              className="form-control border-primary rounded-3"
              type="number"
            />
            <p className="text-danger">{errors.employee?.salary?.message}</p>
          </Col>
        </Row>
      </Stack>

      {/* Restaurant Info */}
      <Stack className="mt-4">
        <h3 className="text-primary mb-3">Restaurant Info</h3>
        <Row xs={1} sm={2} md={3} className="g-3">
          <Col>
            <label className="form-label">Restaurant Name</label>
            <input
              {...register("restaurant.name")}
              style={{ height: "41px" }}
              className="form-control border-primary rounded-3"
            />
            <p className="text-danger">{errors.restaurant?.name?.message}</p>
          </Col>
        </Row>
      </Stack>

      <button
        type="submit"
        onClick={() => {
          onSubmit(getValues());
        }}
        className=" btn btn-primary mt-4 px-4 py-2 rounded-pill shadow"
      >
        update
      </button>
    </form>
  );
};

export default EditForm;
