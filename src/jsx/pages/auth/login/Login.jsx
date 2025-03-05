import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../../assets/images/logo.png";
import logotext from "../../../../assets/images/logo-text.png";
import { Alert, Row, Stack } from "react-bootstrap";
import GoogleAuth from "./GoogleAuth";
import ReCAPTCHA from "react-google-recaptcha";
import { authStore } from "../../../store/authStore";
import { useState } from "react";
import FacebookAuth from "./FacebookAuth";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { getDeviceInfo } from "../../../utils/deviceInfo";

// Define the validation schema using Yup
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "admin@menufy.com",
      password: "Admin@123",
    },
  });

  // Add deviceId state
  const [deviceId, setDeviceId] = useState(() => {
    // Check if deviceId exists in localStorage, if not create and store a new one
    const newDeviceId = getDeviceInfo();
    return newDeviceId;
  });

  const [recaptcha, setRecaptcha] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, currentUser } = authStore();
  const onSubmit = async (data) => {
    try {
      if (!recaptcha) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please verify you are not a robot",
        });
        return;
      }
      // Include deviceId in login data
      await login(data);
      if (currentUser?.user) {
        navigate("/");
      }
    } catch (error) {}
  };

  return (
    <div className="login-form-bx">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6 col-md-7 box-skew d-flex">
            <div className="authincation-content">
              <div className="mb-4">
                <h3 className="mb-1 font-w600">Welcome to Sego</h3>
                <p className="">Sign in by entering information below</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                {currentUser &&
                  currentUser.status == false &&
                  currentUser.message && (
                    <Alert variant="info"> {currentUser.message}</Alert>
                  )}
                <div className="form-group mb-3">
                  <label className="mb-2 form-label">
                    Email <span className="required">*</span>
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input {...field} type="email" className="form-control" />
                    )}
                  />
                  {errors.email && (
                    <div className="text-danger fs-12 my-2">
                      {errors.email.message}
                    </div>
                  )}
                </div>
                <div className="form-group mb-3">
                  <label className="mb-2 form-label">
                    Password <span className="required">*</span>
                  </label>
                  <div className="position-relative">
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                        />
                      )}
                    />
                    <span
                      className={`show-pass eye ${
                        showPassword ? "active" : ""
                      }`}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className="fa fa-eye-slash" />
                      <i className="fa fa-eye" />
                    </span>
                  </div>
                  {errors.password && (
                    <div className="text-danger fs-12 my-2">
                      {errors.password.message}
                    </div>
                  )}
                </div>
                <div className="form-row d-flex justify-content-between mt-4 mb-2">
                  <div className="form-group mb-3">
                    <Stack gap={2}>
                      <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        onChange={(value) => setRecaptcha(value)}
                      />
                      <div className="custom-control custom-checkbox ms-1 ">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="basic_checkbox_1"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="basic_checkbox_1"
                        >
                          Remember my preference
                        </label>
                      </div>
                    </Stack>
                  </div>
                </div>
                <Stack className="text-center" gap={2}>
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign In
                  </button>
                  <Row xs={2} className="justify-content-center ">
                    <FacebookAuth />
                    <GoogleAuth />
                  </Row>
                </Stack>
              </form>
              <div className="new-account mt-2">
                <p className="mb-0">
                  Don&apos;t have an account?{" "}
                  <Link className="text-primary" to="/signup">
                    Sign up
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
              <h2 className="m-b10 ">Login To You Now</h2>
              <p className="m-b40">
                User Experience & Interface Design Strategy SaaS Solutions
              </p>
              <ul className="social-icons mt-4">
                <li>
                  <Link to={"#"}>
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                </li>
                <li>
                  <Link to={"#"}>
                    <i className="fab fa-twitter"></i>
                  </Link>
                </li>
                <li>
                  <Link to={"#"}>
                    <i className="fab fa-linkedin-in"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
