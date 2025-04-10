import { Fragment, useState } from "react";
import { Stepper, Step } from "react-form-stepper";
import { Link } from "react-router-dom";
import logo from "../../../../assets/images/logo.png";
import loginBg from "../../../../assets/images/login/bg-1.jpeg";
import { useResetPassStore } from "../../../store/useResetPassStore";
import StepOne from "./stepsComponents/StepOne";
import StepTwo from "./stepsComponents/StepTwo";
import StepThree from "./stepsComponents/StepThree";
import StepFour from "./stepsComponents/StepFour";

export const ForgotPassword = () => {
  const { goSteps } = useResetPassStore();

  const initialAlertState = { message: "", type: "", show: false };
  const [alert, setAlert] = useState(initialAlertState);

  const handleAlert = (message, type) => {
    setAlert({ message, type, show: true });
    setTimeout(() => setAlert(initialAlertState), 3000);
  };

  const StepsAvailable = [
    <StepOne handleAlert={handleAlert} />,
    <StepTwo handleAlert={handleAlert} />,
    <StepThree handleAlert={handleAlert} />,
    <StepFour handleAlert={handleAlert} />,
  ];

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 p-2 lg-p-4">
      <div className="container w-100 md-m-auto mx-2">
        <div className="row g-0 align-items-center rounded-3 shadow-lg">
          <img
            src={loginBg}
            alt="Background"
            className="d-md-none d-block col-12 rounded-top"
            style={{
              objectPosition: "bottom",
              maxHeight: "200px",
              objectFit: "cover",
            }}
          />
          <div className="col-lg-6 col-md-7 d-flex align-items-center p-4">
            <div className="w-100">
              <img
                src={logo}
                alt="Menufy Logo"
                className="mb-3 w-50 mx-auto d-block"
              />
              <p className="text-center text-muted mb-4">
                Remember your password?{" "}
                <Link
                  className="text-primary"
                  to="/login"
                  style={{ color: "#FF6F61" }}
                >
                  Sign in
                </Link>
              </p>
              {alert.show && (
                <div className={`alert alert-${alert.type} text-center`} role="alert">
                  {alert.message}
                </div>
              )}
              <div className="form-wizard">
                <Stepper
                  className="nav-wizard"
                  activeStep={goSteps}
                  styleConfig={{
                    activeBgColor: "#FA8072",
                    activeTextColor: "#fff",
                    completedBgColor: "#FA8072",
                    completedTextColor: "#fff",
                    inactiveBgColor: "#f5f5f5",
                    inactiveTextColor: "#999",
                    size: "3em",
                    circleFontSize: "1em",
                    labelFontSize: "0.8em",
                    borderRadius: "50%",
                  }}
                  stepClassName="custom-step"
                >
                  <Step label="" />
                  <Step label="" />
                  <Step label="" />
                  <Step label="" />
                </Stepper>
                {StepsAvailable[goSteps]}
              </div>
            </div>
          </div>
          <img
            src={loginBg}
            alt="Background"
            style={{ minHeight: "580px", objectFit: "cover" }}
            className="d-none d-md-block col-lg-6 col-md-5 rounded-end"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
