import { createContext, useEffect, useState } from "react";
import {
  logInUser,
  logOutUser,
  registerUser,
  getAuthorizationCode,
} from "../services/index.js";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import { toast } from "react-toastify";
import { AuthContext } from "./authProvider.js";

//component that will provide the context to the application when needed
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    //get user on initial load and stire in state, make sure react read local storage before loading component
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isLogIn, setIsLogIn] = useState(() => {
    return JSON.parse(localStorage.getItem("isLogIn")) || false;
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const signUp = async (userData) => {
    try {
      //set loading state
      setIsLoading(true);
      //returns a promise thus await response
      const data = await registerUser(userData);
      //if axios response made it this far then their are no req-res errors

      if (data.success) {
        logInState(true);
        navigate("/login");
        setIsLoading(false);
        return toast.info(data.message);
      }
    } catch (e) {
      setIsLoading(false);
      return toast.error(e.message || "Something went wrong, try again");
    }
  };
  const logIn = async (userData) => {
    try {
      setIsLoading(true);
      //returns a promise thus await response
      const response = await logInUser(userData);
      if (response && response.success) {
        const { data } = response;

        setUser(data.user);
        setToken(data.accessToken);
        setRole(data.user.role);

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.accessToken);

        //cancel loading state
        setIsLoading(false);
        return toast.info(response.message || "Logged in successfully");
      }
    } catch (e) {
      setIsLoading(false);
      if (e.code === "ERR_NETWORK") toast.error(`${e.message}, try again`);
      toast.error(e.message);
    }

    // return toast.error(e.message || "Something went wrong, try again")
  };
  const logOut = async () => {
    try {
      //if the response made it this far it was sucesssfull
      setIsLoading(true);
      //make request to logout endpoint
      const response = await logOutUser();

      if (response.success) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        //when user logs out we want to navigate then to login page but the user and token are still in state which will prevent redirection
        setUser(null);
        setToken(null);
        setIsLogIn(true);
        navigate("/login");
        setIsLoading(false);
        return toast.info(response.message);
      }
    } catch (e) {
      setIsLoading(false);
      return toast.error(e.message || "Something went wrong, try again");
    }
  };


  const logInState = (value) => {
    localStorage.setItem("isLogIn", value);
    setIsLogIn(value);
  };
  const redirect = () => {
    useEffect(() => {
      const sendToken = async () => {
        try {
          console.log("hello")
          const response = await getAuthorizationCode();

          if (response.success) {
            const { data } = response;

            setUser(data.user);
            setToken(data.accessToken);

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.accessToken);

            //redirect to dashboard
            navigate("/dashboard");
            return toast.info(data.message || "Logged in successfully");
          }else {
            navigate("/login")
          }
        } catch (e) {
        console.log(e.message)
      };
    }
    sendToken();
    }, [])
  };

  useEffect(() => {
    try {
      //isLogin from localstorage will be a string "true" or "false" thus we need to convert it to parse it to boolean to get the correct 'value
      // let _isLogIn = JSON.parse(localStorage.getItem("isLogIn"));
      const _user = JSON.parse(localStorage.getItem("user"));
      const _isOpen = JSON.parse(localStorage.getItem("isOpen"));
      const _isLogIn = JSON.parse(localStorage.getItem("isLogIn"));
      const _token = localStorage.getItem("token");

      if (_user) setUser(_user);
      if (_token) setToken(_token);
      if (_isLogIn) setIsLogIn(_isLogIn);
      if (_isOpen) setIsOpen(_isOpen);
    } catch (e) {
      console.log(e.message);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUser,
        logIn,
        signUp,
        isLogIn,
        isLoading,
        logOut,
        logInState,
        isOpen,
        redirect,
      }}
    >
      {isLoading ? (
        <Loader className="flex h-screen w-full flex-col items-center justify-center gap-4 dark:bg-gray-900 bg-slate-50" />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
export { AuthProvider };
