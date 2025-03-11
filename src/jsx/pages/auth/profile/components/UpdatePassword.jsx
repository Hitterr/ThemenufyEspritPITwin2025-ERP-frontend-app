import React, { useState } from "react";
import { Form, Button, Card, Row, Col, InputGroup } from "react-bootstrap";
import { authStore } from "../../../../store/authStore";
import Swal from "sweetalert2";
import { updatePasswordFormSchema } from "./validators/UpdatePasswordFormValidator";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const UpdatePassword = () => {
  const { currentUser, updatePassword } = authStore();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      updatePasswordFormSchema.validateSync(passwordData);
      const result = await updatePassword(currentUser.token, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: result.message,
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: result.error || "Failed to update password",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Failed to update password",
      });
    }
  };

  return (
    <Card className="p-4 border rounded shadow bg-white">
      <h3 className="text-primary mb-4">Change Password</h3>
      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                required
                className="border-primary rounded-3"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  className="border-primary rounded-3"
                />
                <Button
                  variant="outline-primary"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="border-0"
                >
                  {showNewPassword ? <BsEyeSlash /> : <BsEye />}
                </Button>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Confirm New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  className="border-primary rounded-3"
                />
                <Button
                  variant="outline-primary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="border-0"
                >
                  {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                </Button>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        <Button
          type="submit"
          className="btn btn-primary mt-4 px-4 py-2 rounded-pill shadow"
        >
          Update Password
        </Button>
      </Form>
    </Card>
  );
};

export default UpdatePassword;
