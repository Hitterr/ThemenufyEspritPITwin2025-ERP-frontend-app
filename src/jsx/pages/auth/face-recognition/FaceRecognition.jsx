import React, { useState, useRef } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { FaCamera, FaUpload, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { authStore } from "../../../store/authStore";
import { getDeviceInfo } from "../../../utils/deviceInfo";
import "./FaceRecognition.css";

const FaceRecognition = ({ show, onHide }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { verifyDevice } = authStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("Please select an image first");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("deviceId", getDeviceInfo());

    try {
      const response = await fetch(
        import.meta.env.VITE_FLASK_BACKEND_URL + "/face/recognize",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "recognized") {
        onHide(); // Close the modal first

        Swal.fire({
          icon: "success",
          title: "Face Recognized!",
          text: `Welcome back, ${data.firstName} ${data.lastName}!`,
          timer: 2000,
          showConfirmButton: false,
        });

        // Store authentication data
        verifyDevice({
          token: data.token,
          user: {
            _id: data.user_id,
            firstName: data.firstName,
            lastName: data.lastName,
          },
        });

        // Navigate to dashboard after successful recognition
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        throw new Error(data.message || "Face recognition failed");
      }
    } catch (error) {
      console.error("Face recognition error:", error);
      setError(error.message || "Failed to recognize face. Please try again.");

      Swal.fire({
        icon: "error",
        title: "Recognition Failed",
        text:
          error.message ||
          "We couldn't recognize your face. Please try again or use another login method.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setImage(null);
    setPreview(null);
    setError(null);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      backdrop="static"
      className="face-recognition-modal"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
          <h4>Face Recognition Login</h4>
          <p className="text-muted small mb-0">
            Login with your face to access your account
          </p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <div className="face-recognition-container text-center">
          <div
            className="face-preview mb-4"
            style={{
              backgroundImage: preview ? `url(${preview})` : "none",
              border: preview ? "2px solid #3a86ff" : "2px dashed #dee2e6",
            }}
          >
            {!preview && (
              <div className="placeholder-content">
                <FaUser size={50} className="text-muted mb-2" />
                <p className="text-muted mb-0">No image selected</p>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="d-none"
          />

          <div className="d-flex justify-content-center gap-3 mb-2">
            <Button
              variant="outline-primary"
              onClick={handleUploadClick}
              disabled={isLoading}
            >
              <FaUpload className="me-2" />
              Upload Photo
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!image || isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Processing...
                </>
              ) : (
                <>
                  <FaCamera className="me-2" />
                  Recognize Me
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 justify-content-center">
        <p className="text-muted mb-0">
          <Button
            variant="link"
            onClick={handleClose}
            className="text-decoration-none p-0"
          >
            Use another login method
          </Button>
        </p>
      </Modal.Footer>
    </Modal>
  );
};

export default FaceRecognition;
