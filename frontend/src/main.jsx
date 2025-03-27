import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, Slide} from "react-toastify";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/auth.context";
import SocketProvider from "./context/socket.io/socketProvider";

createRoot(document.getElementById("root")).render(

    <StrictMode>
      <BrowserRouter>
      <ToastContainer limit={1} transition={Slide} position="top-center" />
          <AuthProvider>
            <SocketProvider>
            <App />
            </SocketProvider>
      
          </AuthProvider>
      
      </BrowserRouter>
    </StrictMode>

);
