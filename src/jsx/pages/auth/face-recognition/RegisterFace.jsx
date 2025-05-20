import React, { useState, useRef } from "react";
import { Modal, Button, Spinner, Alert, Form } from "react-bootstrap";
import { FaCamera, FaUpload, FaUser, FaSave } from "react-icons/fa";
import Swal from "sweetalert2";
import { authStore } from "../../../store/authStore";
import "./FaceRecognition.css";

const RegisterFace = ({ show, onHide }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { currentUser } = authStore();

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

    if (!currentUser?.user?._id) {
      setError("User information not found. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("user_id", currentUser.user._id);

    try {
      const response = await fetch(
        import.meta.env.VITE_FLASK_BACKEND_URL + "/face/register",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        onHide(); // Close the modal first

        Swal.fire({
          icon: "success",
          title: "Face Registered!",
          text: "Your face has been successfully registered for future logins.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message || "Face registration failed");
      }
    } catch (error) {
      console.error("Face registration error:", error);
      setError(error.message || "Failed to register face. Please try again.");

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error.message ||
          "We couldn't register your face. Please try again with a clearer photo.",
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
          <h4>Register Your Face</h4>
          <p className="text-muted small mb-0">
            Add facial recognition to your account for faster login
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

          <Form.Group className="mb-3">
            <Form.Label className="text-start d-block">
              Photo Guidelines:
            </Form.Label>
            <ul className="text-start text-muted small ps-3">
              <li>Make sure your face is clearly visible</li>
              <li>Good lighting conditions</li>
              <li>Neutral expression</li>
              <li>No sunglasses or face coverings</li>
            </ul>
          </Form.Group>

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
                  <FaSave className="me-2" />
                  Register Face
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 justify-content-center">
        <p className="text-muted small mb-0">
          Your facial data is securely stored and used only for authentication
          purposes.
        </p>
      </Modal.Footer>
    </Modal>
  );
};

export default RegisterFace;
