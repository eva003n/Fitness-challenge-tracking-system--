import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Label from "../components/common/label";
import Input from "../components/common/input";
import Button from "../components/common/Button.jsx";
import { useAuth } from "../context/authProvider.js";
import githubLogo from "/icons/github-mark.svg";
import googleLogo from "/icons/google.svg"
import Logo from "../components/common/logo";

//icons
import { Mail, Lock, Loader} from "lucide-react"
import Container from "../components/common/Container.jsx";
import {  getAuthorizationCode, getGoogleAuthorizationUrl} from "../utils";
import { useSocket } from "../context/socket.io/socketContext.js";




const SignUpPage = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const { signUp, logInState, isLogIn, logIn, logInWithIdentityProvider, isLoading } = useAuth();
  const signUpMethod = useRef();
  signUpMethod.current = localStorage.getItem("signUpMethod") || "normal" 
  const code = useRef(null)

  useEffect(() => {
const authenticate = async () => {
  if(window.location.pathname === "/login") logInState(true)
    //check if the url has authorization code from google or github
    code.current = getAuthorizationCode();
  // signUpMethod.current = localStorage.getItem("signUpMethod")
  if(code.current) await logInWithIdentityProvider(code.current, signUpMethod.current)

    
  }
authenticate()

    // //cleanup function to remove the code from url after use
    return () => {
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      window.history.replaceState({}, document.title, url.toString());
    };
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };
  const handleSignUpWithGithub = async(e) => {
    //prevent the default behaviour of submmiting the data to server
    e.preventDefault();
    signUpMethod.current = "github"
    localStorage.setItem("signUpMethod", "github")
    //redirect to github authorization page
   window.location.href = import.meta.env.VITE_GITHUB_URL;
    
    
  };

  const handleSignUpWithGoogle = async(e) => {
    e.preventDefault()
  //redirect to ggogle authorication page
  console.dir(getGoogleAuthorizationUrl())
   window.location.href = getGoogleAuthorizationUrl()
    signUpMethod.current = "google"
    localStorage.setItem("signUpMethod", "google")
     
    
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    signUpMethod.current = "normal"
    localStorage.setItem("signUpMethod", "normal")

    if (isLogIn) {
      //api call to login endpoint

      await logIn(data);
    } else {
      //api call to signup endpoint
      await signUp(data);
    }
  };

  return (
    <Container>
      <div className="flex items-center">

        <form
          className="grid w-[90%] max-w-sm gap-2 mx-auto rounded-lg bg-slate-100 px-4 py-8 text-violet-700 dark:bg-gray-800/40"
          onSubmit={(e) => handleSubmit(e)}
          disabled={isLoading}
        >
          <div className="mb-5 flex justify-center">
            <Logo />
          </div>
          <h2 className="mb-6 text-center text-2xl font-bold tracking-wide md:tracking-wider">
            {isLogIn ? "Login to your account " : "Create an account"}
          </h2>
          <Label htmlFor="email">Email</Label>
          <Input
            icon={Mail}
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="pl-10 dark:bg-slate-700"
            onChange={(e) => handleChange(e)}
          />
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {isLogIn ? (
              <Link to="#" className="text-violet-600 hover:text-violet-700">
                Forgot Password
              </Link>
            ) : (
              ""
            )}
          </div>
          <Input
            icon={Lock}
            id="password"
            name="password"
            type="password"
            value={data.password}
            onChange={(e) => handleChange(e)}
            className="pl-10 dark:bg-slate-700"
          />
          <Button
            className="mt-3 bg-violet-600 disabled:bg-violet-700 text-gray-50"
            name={isLogIn ? " Log in " : " Sign up"}
            disabled={Object.values(data).some((value) => !value || isLoading)}
            icon={ signUpMethod.current === "normal" && isLoading && Loader}
            loader={isLoading}
            isLoading={isLoading}
          ></Button>
          <p className="text-center text-gray-800 dark:text-gray-400">Or continue with </p>
          <div className="flex gap-4 ">
            <Button
              onClick={(e) => handleSignUpWithGithub(e)}
              className="mt-3 bg-violet-600 disabled:bg-violet-700 grow flex items-center text-gray-100"
              disabled={Object.values(data).some((value) => value) || isLoading}
              icon={ signUpMethod.current === "github" && isLoading && Loader}
              loader={isLoading}
              isLoading={isLoading}
            >
              <div className="w-6"><img src={githubLogo} alt="github logo icon"  /></div>
              {isLogIn ? "Github" : "Github"}
            </Button>
            <Button
              onClick={(e) => handleSignUpWithGoogle(e)}
              className="mt-3 bg-violet-600 disabled:bg-violet-700 text-gray-100 grow flex items-center"
              disabled={Object.values(data).some((value) => value) || isLoading}
              icon={ signUpMethod.current === "google" && isLoading && Loader}
              loader={isLoading}
              isLoading={isLoading}

                            
            >
              <div className="w-5"><img src={googleLogo} alt="google logo icon"  /></div>
              {isLogIn ? " Google" : " Google"}
          
            </Button>
          </div>
          <p className="text-center">
            <span className="text-gray-800 dark:text-gray-400">
              {isLogIn ? "Don't have an account?" : "Already have an account?"}
              <Link
                to={isLogIn ? "/signup" : "/login"}
                className="cursor-pointer text-violet-600 hover:text-violet-700 hover:underline"
                onClick={() => (isLogIn ? logInState(false) : logInState(true))}
              >
                {" "}
                {isLogIn ? "Sign up" : "Log in"}
              </Link>
            </span>
          </p>
        </form>
      </div>
    </Container>
  );
};

export default SignUpPage;
