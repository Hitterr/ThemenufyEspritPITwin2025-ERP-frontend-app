import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaUserPlus } from "react-icons/fa";
import RegisterFace from "./RegisterFace";
import { ScanFace } from "lucide-react";

const RegisterFaceButton = ({
  buttonText = "Register Face ID",
  variant = "outline-primary",
  className = "",
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleHideModal = () => setShowModal(false);

  return (
    <>
      <Button variant={variant} className={className} onClick={handleShowModal}>
        <ScanFace className="me-2" />
        {buttonText}
      </Button>

      <RegisterFace show={showModal} onHide={handleHideModal} />
    </>
  );
};

export default RegisterFaceButton;
