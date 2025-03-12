import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Stepper, Step } from "react-form-stepper";
import logo from "../../../../assets/images/logo.png";
import logotext from "../../../../assets/images/logo-text.png";
import {useResetPassStore } from "../../../store/useResetPassStore"; 
import axios from "axios";
const initialAlertState = { message: "", type: "", show: false };
function ForgotPassword() {
  const {
    email,
    setEmail,
    verificationCode,
    setVerificationCode,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    goSteps,
    setGoSteps,
    resetState, 
  } = useResetPassStore();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });
  const [alert, setAlert] = useState(initialAlertState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleAlert = (message, type) => {
    setAlert({ message, type, show: true });
    setTimeout(() => setAlert(initialAlertState), 3000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
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
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "Please enter the verification code.",
      }));
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password/verify-code",
        {
          email,
          resetCode: verificationCode,
        }
      );
      if (response.data.success) {
        handleAlert("Code verified!", "success");
        setGoSteps(2);
      } else {
        setErrors((prev) => ({
          ...prev,
          verificationCode: response.data.message || "Invalid code.",
        }));
      }
    } catch (error) {
      handleAlert(
        error.response?.data?.message || "Error verifying code.",
        "danger"
      );
    }
  };
  const handlePasswordReset = async () => {
    if (!password || !confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        password: "Password fields cannot be empty.",
        confirmPassword: "",
      }));
      return;
    }
    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password/reset-password",
        {
          email,
          resetCode: verificationCode,
          newPassword: password,
        }
      );
      handleAlert(response.data.message, "success");
      setGoSteps(3);
      resetState(); 
    } catch (error) {
      console.error("Reset password error:", error.response || error);
      handleAlert(
        error.response?.data?.message || "Error resetting password.",
        "danger"
      );
    }
  };
  return (
    <div className="login-form-bx">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6 col-md-7 box-skew d-flex">
            <div className="authincation-content">
              <div className="mb-0">
                <h3 className="mb-1 font-w600">Forgot Password</h3>
                <p>Follow the steps to reset your password.</p>
              </div>
              {alert.show && (
                <div
                  className={`alert alert-${alert.type} text-center`}
                  role="alert"
                >
                  {alert.message}
                </div>
              )}
              <Stepper
                className="nav-wizard step-form-horizontal"
                activeStep={goSteps}
                styleConfig={{
                  activeBgColor: "#ea7a9a",
                  activeTextColor: "#fff",
                  completedBgColor: "#ea7a9a",
                  completedTextColor: "#fff",
                  inactiveBgColor: "#d3d9de",
                  inactiveTextColor: "#fff",
                  inactiveBorderColor: "#d3d9de",
                  inactiveBorderWidth: "0px",
                }}>
                <Step className="nav-link step-btn" label="Enter Email" />
                <Step className="nav-link step-btn" label="Verify Code" />
                <Step className="nav-link step-btn" label="Reset Password" />
                <Step className="nav-link step-btn" label="Success" />
              </Stepper>
              {goSteps === 0 && (
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label className="mb-2 form-label">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                      <div className="text-danger fs-12">{errors.email}</div>
                    )}
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-block">
                      Send Verification Code
                    </button>
                  </div>
                </form>
              )}
              {goSteps === 1 && (
                <div>
                  <p>Enter the verification code sent to your email.</p>
                  <div className="form-group mb-3">
                    <label className="mb-2 form-label">
                      Verification Code <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    {errors.verificationCode && (
                      <div className="text-danger fs-12">
                        {errors.verificationCode}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={handleVerifyCode}
                    >
                      Verify Code
                    </button>
                  </div>
                </div>
              )}
              {goSteps === 2 && (
                <div>
                  <div className="form-group mb-3">
                    <label className="mb-2 form-label">
                      New Password <span className="required">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span
                        className="input-group-text"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          cursor: "pointer",
                          backgroundColor: "#fff",
                          borderLeft: "none",
                          borderColor: "#ced4da",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0 12px",
                        }}>
                        <i className={
                            showPassword ? "fas fa-eye-slash" : "fas fa-eye"
                          }
                          style={{ color: "#6c757d", fontSize: "16px" }}
                        ></i>
                      </span>
                    </div>
                    {errors.password && (
                      <div className="text-danger fs-12">{errors.password}</div>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label className="mb-2 form-label">
                      Confirm Password <span className="required">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <span
                        className="input-group-text"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        style={{
                          cursor: "pointer",
                          backgroundColor: "#fff",
                          borderLeft: "none",
                          borderColor: "#ced4da",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0 12px",
                        }}
                      >
                        <i
                          className={
                            showConfirmPassword
                              ? "fas fa-eye-slash"
                              : "fas fa-eye"
                          }
                          style={{ color: "#6c757d", fontSize: "16px" }}
                        ></i>
                      </span>
                    </div>
                    {errors.confirmPassword && (
                      <div className="text-danger fs-12">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={handlePasswordReset}
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              )}
              {goSteps === 3 && (
                <div className="text-center">
                  <h3>Password Reset Successfully!</h3>
                  <p>You can now sign in with your new password.</p>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => navigate("/login")}
                  >
                    Go to Sign In
                  </button>
                </div>
              )}
              <div className="new-account mt-2">
                <p className="mb-0">
                  Remember your password?{" "}
                  <Link className="text-primary" to="/login">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-5 d-flex box-skew1">
            <div className="inner-content align-self-center">
              <Link to="/dashboard" className="login-logo">
                <img src={logo} alt="" className="logo-icon me-2" />
                <img src={logotext} alt="" className="logo-text ms-1" />
              </Link>
              <h2 className="m-b10">Reset Your Password</h2>
              <p className="m-b40">
                Follow the steps to securely reset your password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ForgotPassword;