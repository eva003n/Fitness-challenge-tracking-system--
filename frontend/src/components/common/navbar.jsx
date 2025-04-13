import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/authProvider";
import { X } from "lucide-react";

import Button from "./Button";

const Navbar = ({ ...props }) => {
  const { user, token, logInState } = useAuth();



  return (
    <nav className={props.className}>
      <ul className={props.childclasses}>
        {user && token ? (
          ""
        ) : (
          <>
            <li>
              <NavLink to="/" end className="tracking-wider">
                Home
              </NavLink>
            </li>

            {/* <li>
=======
{/*             <li>

              <NavLink to="/about" end className="tracking-wider">
                About
              </NavLink>
            </li> */}

            {/* <li>
=======
{/*             <li>
>>>>>>> c193d4c6919a51cab11cec0d99190518088fcc78
              <NavLink to="/faq" end className="tracking-wider">
                FAQ
              </NavLink>
            </li> */}
          </>
          
        )}
       
      </ul>

      {!user && (
        <div className={`md:hidden ${!user ? "-order-1 ml-auto mt-4" : ""}`}>
          <Button 
          onClick={() => props.setIsOpen(false)}
          className="text-gray-700 dark:text-gray-400"
          >
            <X />
          </Button>
        </div>
      )}

      {
          <Button name={
            <NavLink
            to={"/login"}
            className="nav-top text-gray-700 dark:text-gray-100  rounded-md md:bg-violet-600 md:text-gray-100 px-4 py-1.5 tracking-wider "
            onClick={() => logInState(true)}
          >
            Log in
          </NavLink>
           }>
            
          </Button>
}
    </nav>
  );
};

export default Navbar;
