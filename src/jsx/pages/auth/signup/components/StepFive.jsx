import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signupStore } from "../../../../store/signupStore";
import PhoneInput from "react-phone-input-2";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const StepFive = () => {
  const { setStep, step, setCurrentUser, currentUser } = signupStore();

  const schema = yup.object().shape({
    nameRes: yup.string().required("Restaurant name is required"),
    phone: yup.string().required("Phone is required"),
    address: yup.string().required("Address is required"),
    cuisineType: yup.string().required("Cuisine type is required"),
    taxeTPS: yup.number().min(0, "TPS tax must be 0 or greater").required(),
    taxeTVQ: yup.number().min(0, "TVQ tax must be 0 or greater").required(),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nameRes: currentUser.nameRes || "",
      phone: currentUser.phone || "",
      address: currentUser.address || "",
      cuisineType: currentUser.cuisineType || "",
      taxeTPS: currentUser.taxeTPS || 0,
      taxeTVQ: currentUser.taxeTVQ || 0,
      color: currentUser.color || "",
      logo: currentUser.logo || "",
      promotion: currentUser.promotion || "",
      payCashMethod: currentUser.payCashMethod || true,
    },
  });

  const onSubmit = (data) => {
    setCurrentUser({ restaurant: data });
    setStep(step + 1);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="row-cols-2 flex-wrap">
        <Form.Group as={Col} className="mb-3">
          <Form.Label>Restaurant Name</Form.Label>
          <Controller
            name="nameRes"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                isInvalid={!!errors.nameRes}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.nameRes?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Controller
            name={"phone"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                country={"tn"}
                value={value?.toString() || ""}
                onChange={onChange}
                inputClass="form-control  rounded-3 w-100"
                containerClass="w-100 h-100 p-0"
                inputStyle={{ height: "41px" }}
                containerStyle={{ height: "41px" }}
                buttonStyle={{ height: "41px" }}
                buttonClass="bg-white  rounded-start-3"
              />
            )}
          />
          {errors.phone && (
            <div className="invalid-feedback">{errors.phone.message}</div>
          )}
          <Form.Control.Feedback type="invalid">
            {errors.phone?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} className="mb-3">
          <Form.Label>Address</Form.Label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                isInvalid={!!errors.address}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.address?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} className="mb-3">
          <Form.Label>Cuisine Type</Form.Label>
          <Controller
            name="cuisineType"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                isInvalid={!!errors.cuisineType}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.cuisineType?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} className="mb-3">
          <Form.Label>TPS Tax (%)</Form.Label>
          <Controller
            name="taxeTPS"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="number"
                isInvalid={!!errors.taxeTPS}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.taxeTPS?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} className="mb-3">
          <Form.Label>TVQ Tax (%)</Form.Label>
          <Controller
            name="taxeTVQ"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="number"
                isInvalid={!!errors.taxeTVQ}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.taxeTVQ?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row className="d-flex justify-content-between align-items-center mt-4">
        <Col xs={12} md={6}>
          <button
            type="button"
            className="btn w-100 btn-secondary"
            onClick={() => setStep(step - 1)}
          >
            <FaArrowLeft size={20} />
          </button>
        </Col>
        <Col xs={12} md={6}>
          <button type="submit" className="btn w-100 btn-primary">
            <FaArrowRight size={20} />
          </button>
        </Col>
      </Row>
    </Form>
  );
};

export default StepFive;
