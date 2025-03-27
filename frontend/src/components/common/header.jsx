import { useState } from "react";
import Logo from "./logo";
import Navbar from "./navbar";
import Avatar from "./avatar";

import { Bell, Menu, Flame, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authProvider";
import SearchBar from "./SearchBar";
import Notify from "./Notify";
import Streak from "./Streak";

const Header = () => {
const {user, token} = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const handleClickMenu = () => {
    setIsOpen(true);
  };
  
  return (
    <header className="flex  items-center justify-between bg-slate-200 px-4  md:gap-4 dark:bg-gray-900 dark:border-b-2 border-b-gray-800  h-min py-2 dark:text-white">
      <section className="flex gap-3 mr-auto sm:mr-0">
        <Logo />
      </section>
      {/* {user && <SearchBar className="ml-34 hidden md:flex " placeholder="Search challenges" width={30} />} */}
      {!user && !token && (
        <Navbar
          className={`z-100 max-w-]2xs fixed -right-[100%] top-0 flex h-screen w-3/4 flex-col justify-start gap-4 bg-violet-50 px-4 font-normal md:static md:h-auto md:w-auto md:max-w-none md:grow md:flex-row md:bg-none md:px-0 dark:bg-gray-900 ${isOpen ? "open" : ""}`}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          childclasses="nav-top flex flex-col items-center gap-4 md:m-auto md:flex-row md:gap-12"
        ></Navbar>
      )}
      {user && (
        <div className="md:order-0  mt-4 flex items-center justify-between gap-8 md:mt-0 ">
          <div className="relative hidden md:flex">
            {/* <span className="absolute -right-3 -top-3 flex aspect-square w-5 items-center justify-center rounded-full bg-violet-400 text-[.8rem] text-white">
              4
            </span> */}
            <Link to={user && user.role === "admin"? "/admin/notifications" : "/notifications"}>
              {/* <Bell size={16} strokeWidth={2} strokeOpacity={0.7} /> */}
              <Notify />
            </Link>
          </div>
         {
          user && user.role !== "admin" && (
            <div className="flex gap-2">
            <Streak/>
           </div>
          )
         }
         <div className=" md:flex ">
         <Link to={ user && user.role === "admin"? "/admin/profile" : "/profile"}>{ <Avatar />}</Link>
         </div>
          {/* <Button onClick={() => setIsOpen(false)} className="md:hidden">
            <X />
          </Button> */}
        </div>
      )}
      {/* <div className="md:hidden" onClick={handleClickMenu}>
        <Menu />
      </div> */}
    </header>
  );
};



export default Header


