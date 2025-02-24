import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Col, Row, Stack } from "react-bootstrap";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .required("Required"),
  lastName: yup
    .string()
    .min(3, "Must be at least 3 characters")
    .required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  phone: yup
    .string()
    .matches(/^\d{8}$/, "Phone must be 8 digits")
    .required("Required"),
  address: yup.string().required("Required"),
  employee: yup.object({
    salary: yup
      .number()
      .positive("Must be positive")
      .integer("Must be an integer")
      .required("Required"),
  }),
  restaurant: yup.object({
    name: yup.string().required("Required"),
  }),
  image: yup.string().url("Invalid URL").required("Required"),
});

const EditForm = ({ defaultValues, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded">
      <h3>User Info</h3>
      <Row xs={1} sm={2} md={3} className="">
        <Col>
          <label>First Name</label>
          <input {...register("firstName")} className="form-control" />
          <p className="text-danger">{errors.firstName?.message}</p>
        </Col>
        <Col>
          <label>Last Name</label>
          <input {...register("lastName")} className="form-control" />
          <p className="text-danger">{errors.lastName?.message}</p>
        </Col>
        <Col>
          <label>Email</label>
          <input {...register("email")} className="form-control" />
          <p className="text-danger">{errors.email?.message}</p>
        </Col>
        <Col>
          <label>Phone</label>
          <input {...register("phone")} className="form-control" />
          <p className="text-danger">{errors.phone?.message}</p>
        </Col>
        <Col>
          <label>Address</label>
          <input {...register("address")} className="form-control" />
          <p className="text-danger">{errors.address?.message}</p>
        </Col>
      </Row>
      <Stack>
        <h3>Employee Info</h3>
        <Row xs={1} sm={2} md={3} className="">
          <Col>
            <label>Salary</label>
            <input
              {...register("employee.salary")}
              className="form-control"
              type="number"
            />
            <p className="text-danger">{errors.employee?.salary?.message}</p>
          </Col>
        </Row>
      </Stack>
      <Stack>
        <h3>Restaurant Info</h3>
        <Row xs={1} sm={2} md={3} className="">
          <Col>
            <label>Restaurant Name</label>
            <input {...register("restaurant.name")} className="form-control" />
            <p className="text-danger">{errors.restaurant?.name?.message}</p>
          </Col>
        </Row>
      </Stack>

      <button type="submit" className="btn btn-primary mt-3">
        Update
      </button>
    </form>
  );
};

export default EditForm;
