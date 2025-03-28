import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Label from "../components/common/label";
import Input from "../components/common/input";
import Button from "../components/common/Button.jsx";
import { useAuth } from "../context/authProvider.js";
import githubLogo from "/icons/github-mark.svg";
import Logo from "../components/common/logo";

//icons
import { Mail } from "lucide-react";
import { Lock } from "lucide-react";
import Container from "../components/common/Container.jsx";


const SignUpPage = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const { signUp, logInState, isLogIn, logIn } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };
  const handleSignUpWithGithub = (e) => {
    //prevent the default behaviour of submmiting the data to server
    e.preventDefault();
    //redirect to github authorization page
    window.location.href = import.meta.env.VITE_GITHUB_URL;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogIn) {
      //api call to login endpoint

      await logIn(data);
    } else {
      //api call to signup endpoint
      await signUp(data);
    }
    // console.log(data);
  };

  return (
    <Container>
      <div className="flex items-center">

        <form
          className="grid w-[90%] max-w-sm gap-2 mx-auto rounded-lg bg-slate-100 px-4 py-8 text-violet-700 dark:bg-gray-800/40"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="mb-5 flex justify-center">
            <Logo />
          </div>
          <h2 className="mb-6 text-center text-2xl font-bold tracking-wide md:tracking-wider">
            {isLogIn ? "Welcome back " : "Create an account"}
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
            className="mt-3 bg-violet-600 disabled:bg-violet-700"
            name={isLogIn ? " Log in " : " Sign up"}
            disabled={Object.values(data).some((value) => !value)}
          ></Button>
          <p className="text-center text-gray-300">Or continue with </p>
          <Button
            onClick={(e) => handleSignUpWithGithub(e)}
            className="mt-3 bg-violet-600 disabled:bg-violet-700"
            disabled={Object.values(data).some((value) => value)}
          >
            <div className="w-6"><img src={githubLogo} alt="github logo icon"  /></div>
            {isLogIn ? "Log in with Github" : "Sign up with Github"}
          </Button>
          <p className="text-center">
            <span className="text-gray-800 dark:text-white">
              {isLogIn ? "Don't have an account?" : "Already have an account?"}
              <Link
                to={isLogIn ? "/signup" : "/login"}
                className="cursor-pointer text-violet-600 hover:text-violet-700"
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
