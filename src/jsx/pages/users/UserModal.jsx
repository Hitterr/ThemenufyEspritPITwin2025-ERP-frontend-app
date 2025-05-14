import React, { useEffect } from "react";
import { Modal, Form, Button, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useUserStore } from "../../store/UserStore";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .when("isEditMode", {
      is: false,
      then: yup.string().required("Password is required"),
    }),
  phone: yup.string(),
  address: yup.string(),
  birthday: yup.string(),
  role: yup
    .string()
    .oneOf(["admin", "superadmin", "employee", "client"])
    .required("Role is required"),
  isEmailVerified: yup.boolean(),
  authProvider: yup
    .string()
    .oneOf(["local", "google", "facebook"])
    .default("local"),
});

const UserModal = ({ modalState, setModalState }) => {
  const { addUser, updateUser } = useUserStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (
      modalState.selectedUser &&
      (modalState.isEditMode || modalState.viewMode)
    ) {
      Object.keys(modalState.selectedUser).forEach((key) => {
        setValue(key, modalState.selectedUser[key]);
      });
    } else {
      reset();
    }
  }, [modalState, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      if (modalState.isEditMode) {
        await updateUser(modalState.selectedUser._id, data);
      } else {
        await addUser(data);
      }
      setModalState((prev) => ({ ...prev, show: false }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal
      show={modalState.show}
      size="lg"
      onHide={() => setModalState((prev) => ({ ...prev, show: false }))}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {modalState.isEditMode
            ? "Edit User"
            : modalState.viewMode
            ? "User Details"
            : "Add User"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="row-cols-2">
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                {...register("firstName")}
                disabled={modalState.viewMode}
              />
              {errors.firstName && (
                <Form.Text className="text-danger">
                  {errors.firstName.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                {...register("lastName")}
                disabled={modalState.viewMode}
              />
              {errors.lastName && (
                <Form.Text className="text-danger">
                  {errors.lastName.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                {...register("email")}
                disabled={modalState.viewMode}
              />
              {errors.email && (
                <Form.Text className="text-danger">
                  {errors.email.message}
                </Form.Text>
              )}
            </Form.Group>

            {!modalState.isEditMode && !modalState.viewMode && (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" {...register("password")} />
                {errors.password && (
                  <Form.Text className="text-danger">
                    {errors.password.message}
                  </Form.Text>
                )}
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                {...register("phone")}
                disabled={modalState.viewMode}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                {...register("address")}
                disabled={modalState.viewMode}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type="date"
                {...register("birthday")}
                disabled={modalState.viewMode}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select {...register("role")} disabled={modalState.viewMode}>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
                <option value="employee">Employee</option>
                <option value="client">Client</option>
              </Form.Select>
              {errors.role && (
                <Form.Text className="text-danger">
                  {errors.role.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Verified"
                {...register("isVerified")}
                disabled={modalState.viewMode}
              />
            </Form.Group>
          </Row>
          {!modalState.viewMode && (
            <Button type="submit" variant="primary">
              {modalState.isEditMode ? "Update" : "Create"}
            </Button>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserModal;
