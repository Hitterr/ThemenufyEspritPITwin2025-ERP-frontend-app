import { useState } from "react";
import { useResetPassStore } from "../../../../store/useResetPassStore";
import axios from "axios";
import { Row } from "react-bootstrap";

const StepOne = ({ handleAlert }) => {
  const { email, setEmail, setGoSteps } = useResetPassStore();
  const [errors, setErrors] = useState({ email: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/auth/reset-password/request-reset-password",
        { email }
      );
      handleAlert(`Verification code sent to ${email}`, "info");
      setGoSteps(1);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error sending reset link. Please try again.";
      handleAlert(errorMessage, "danger");
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label className="form-label" style={{ color: "#FF6F61" }}>
            Email Address <span className="required" style={{ color: "#FF6F61" }}>*</span>
          </label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
        <Row className="gap-2 justify-content-end">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ backgroundColor: "#FF6F61", borderColor: "#FF6F61" }}
          >
            Send Code
          </button>
        </Row>
      </form>
    </section>
  );
};

export default StepOne;
