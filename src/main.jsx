import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ThemeContext from "./context/ThemeContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // Replace with your Google OAuth client ID
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/vite/demo">
      <ThemeContext>
        <GoogleOAuthProvider clientId={clientId}>
          <ToastContainer />
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </GoogleOAuthProvider>
      </ThemeContext>
    </BrowserRouter>
  </StrictMode>
);
