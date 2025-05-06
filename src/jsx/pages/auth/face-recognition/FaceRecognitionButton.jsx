import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaCamera, FaCentercode } from "react-icons/fa";
import FaceRecognition from "./FaceRecognition";
import { ScanFace } from "lucide-react";

const FaceRecognitionButton = ({
  buttonText = "Login with Face Recognition",
  variant = "outline-primary",
  className = "",
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleHideModal = () => setShowModal(false);

  return (
    <>
      <Button variant={variant} className={className} onClick={handleShowModal}>
        <ScanFace className="me-2" size={20} />
        {buttonText}
      </Button>

      <FaceRecognition show={showModal} onHide={handleHideModal} />
    </>
  );
};

export default FaceRecognitionButton;
