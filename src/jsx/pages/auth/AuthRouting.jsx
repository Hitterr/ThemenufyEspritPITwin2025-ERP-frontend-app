import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./login/Login";
import { authStore } from "../../store/authStore";
import { useEffect, useMemo } from "react";
import ForgotPassword from "./reset-password/ForgotPassword";
import Signup from "./signup/Signup";
import DeviceVerification from "./login/DeviceVerification";

export default function AuthRouting() {
  const { currentUser, verifyDevice, getProfile, logout } = authStore();
  const location = useLocation();
  const availableRoutes = useMemo(
    () => ["/login", "/forgotPassword", "/signup"],
    []
  );
  const navigate = useNavigate();
  useEffect(() => {
    const checkDevice = async () => {
      if (
        currentUser?.user &&
        currentUser?.token &&
        !location.pathname.includes("/verify-device")
      ) {
        localStorage.setItem("token", currentUser.token);
        const user = await getProfile(currentUser.token);
        if (!user) {
          logout();
        } else {
          verifyDevice(user);
        }
      }
    };
    checkDevice();
    if (!currentUser?.user && !availableRoutes.includes(location.pathname)) {
      navigate("/login");
    } else if (
      currentUser?.user &&
      availableRoutes.includes(location.pathname)
    ) {
      navigate("/");
    }
  }, [location.pathname]);

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
