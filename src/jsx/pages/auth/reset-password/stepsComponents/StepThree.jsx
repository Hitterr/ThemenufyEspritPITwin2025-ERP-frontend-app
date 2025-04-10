import { useState } from "react";
import { useResetPassStore } from "../../../../store/useResetPassStore";
import axios from "axios";
import { Row } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const StepThree = ({ handleAlert }) => {
  const {
    email,
    verificationCode,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    setGoSteps,
  } = useResetPassStore();
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordReset = async () => {
    if (!password || !confirmPassword) {
      setErrors({
        password: "Password fields cannot be empty.",
        confirmPassword: "",
      });
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ password: "", confirmPassword: "Passwords do not match." });
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password/reset-password",
        { email, resetCode: verificationCode, newPassword: password }
      );
      handleAlert(response.data.message, "success");
      setGoSteps(3);
    } catch (error) {
      handleAlert(
        error.response?.data?.message || "Error resetting password.",
        "danger"
      );
    }
  };

  return (
    <section>
      <div className="form-group mb-3">
        <label className="form-label" style={{ color: "#FA8072" }}>
          New Password <span className="required" style={{ color: "#FA8072" }}>*</span>
        </label>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: "#FA8072",
              color: "#fff",
              borderRadius: "0 0.375rem 0.375rem 0",
              padding: "0.5rem 0.75rem",
            }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && (
          <div className="invalid-feedback">{errors.password}</div>
        )}
      </div>
      <div className="form-group mb-3">
        <label className="form-label" style={{ color: "#FA8072" }}>
          Confirm Password <span className="required" style={{ color: "#FA8072" }}>*</span>
        </label>
        <div className="input-group">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: "#FA8072",
              color: "#fff",
              borderRadius: "0 0.375rem 0.375rem 0",
              padding: "0.5rem 0.75rem",
            }}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <div className="invalid-feedback">{errors.confirmPassword}</div>
        )}
      </div>
      <Row className="gap-2 justify-content-end">
        <button
          className="btn"
          onClick={handlePasswordReset}
          style={{ backgroundColor: "#FA8072", color: "#fff" }}
        >
          Reset Password
        </button>
      </Row>
    </section>
  );
};

export default StepThree;
