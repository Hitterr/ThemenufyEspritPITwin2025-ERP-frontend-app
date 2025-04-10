import { useState } from "react";
import { useResetPassStore } from "../../../../store/useResetPassStore";
import axios from "axios";
import { Row } from "react-bootstrap";

const StepTwo = ({ handleAlert }) => {
  const { email, verificationCode, setVerificationCode, setGoSteps } =
    useResetPassStore();
  const [errors, setErrors] = useState({ verificationCode: "" });

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setErrors({ verificationCode: "Please enter the verification code." });
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password/verify-code",
        { email, resetCode: verificationCode }
      );
      if (response.data.success) {
        handleAlert("Code verified!", "success");
        setGoSteps(2);
      } else {
        setErrors({
          verificationCode: response.data.message || "Invalid code.",
        });
      }
    } catch (error) {
      handleAlert(
        error.response?.data?.message || "Error verifying code.",
        "danger"
      );
    }
  };

  return (
    <section>
      <p style={{ color: "#FA8072" }}>
        Enter the verification code sent to your email.
      </p>
      <div className="form-group mb-3">
        <label className="form-label" style={{ color: "#FA8072" }}>
          Verification Code <span className="required" style={{ color: "#FA8072" }}>*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.verificationCode ? "is-invalid" : ""}`}
          placeholder="Enter code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        {errors.verificationCode && (
          <div className="invalid-feedback">{errors.verificationCode}</div>
        )}
      </div>
      <Row className="gap-2 justify-content-end">
        <button
          className="btn btn-primary"
          onClick={handleVerifyCode}
          style={{ backgroundColor: "#FA8072", borderColor: "#FA8072" }}
        >
          Verify Code
        </button>
      </Row>
    </section>
  );
};

export default StepTwo;
