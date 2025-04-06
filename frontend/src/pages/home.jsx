import Button from "../components/common/Button";
import Container from "../components/common/Container";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authProvider";
import { Section } from "lucide-react";

const Home = () => {
  const { logInState } = useAuth();
  return (
    <section>
      <div className='relative isolate flex min-h-svh flex-col items-center justify-start gap-4 bg-[url("/images/her0-1.png")] bg-right'>
        <div className="-z-1 absolute left-0 top-0 h-full w-full bg-black/50"></div>
        <div className="mt-20 grid max-w-[36rem] gap-4 text-center">
          <h1 className="text-3xl md:text-5xl font-semibold leading-normal tracking-wider text-slate-50">
            Track Your Progress. Stay Motivated. Achieve More
          </h1>
          <p className="text-gray-400 p-4">
          Take your fitness journey to the next level with our Fit track! Whether you're a beginner or a pro, our platform helps you stay accountable and push your limits. Start your challenge today and achieve more than ever before!
          </p>
          <div className="flex items-center justify-center">
            <Link to={"/signup"} onClick={logInState(false)}>
              <Button
                name={"Get Started"}
                className="bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-gray-100"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
