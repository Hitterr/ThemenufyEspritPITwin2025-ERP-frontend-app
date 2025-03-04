import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./login/Login";
import { authStore } from "../../store/authStore";
import { useEffect, useMemo } from "react";
import ForgotPassword from "./reset-password/ForgotPassword";
import Signup from "./signup/Signup";
import DeviceVerification from "./login/DeviceVerification";

export default function AuthRouting() {
  const { currentUser, checkDevice, logout } = authStore();
  const location = useLocation();
  const availableRoutes = useMemo(
    () => ["/login", "/forgotPassword", "/signup"],
    []
  );
  const navigate = useNavigate();
  useEffect(() => {
    const verifyDevice = async () => {
      if (
        currentUser?.user &&
        currentUser?.token &&
        !location.pathname.includes("/verify-device")
      ) {
        localStorage.setItem("token", currentUser.token);
        const isVerified = await checkDevice(currentUser.token);
        if (!isVerified) {
          logout();
          navigate("/login");
        }
      }
    };

    verifyDevice();
  }, [currentUser, checkDevice, logout, location.pathname]);
  useEffect(() => {
    if (!currentUser?.user && !availableRoutes.includes(location.pathname)) {
      navigate("/login");
    } else if (
      currentUser?.user &&
      availableRoutes.includes(location.pathname)
    ) {
      navigate("/");
    }
  }, [currentUser, navigate, availableRoutes, location.pathname]);
  return (
    <Routes>
      <Route path="login" element={<Login />}></Route>
      <Route path="forgotPassword" element={<ForgotPassword />}></Route>
      <Route path="signup" element={<Signup />}></Route>
      <Route
        path="verify-device/:token"
        element={<DeviceVerification />}
      ></Route>
    </Routes>
  );
}
