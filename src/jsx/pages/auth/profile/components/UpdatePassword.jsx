import React, { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { authStore } from "../../../../store/authStore";
import Swal from "sweetalert2";

const UpdatePassword = () => {
  const { currentUser, updatePassword } = authStore();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "New passwords do not match",
      });
      return;
    }

    try {
      const result = await updatePassword(currentUser.token, {
        oldPassword: passwordData.currentPassword,
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
        throw new Error(result.error);
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
              <Form.Control
                type="password"
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
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
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