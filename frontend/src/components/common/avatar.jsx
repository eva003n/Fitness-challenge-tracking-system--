import { useEffect, useState } from "react";
import { useAuth } from "../../context/authProvider";
import { useSocket } from "../../context/socket.io/socketContext";


const Avatar = ({ width = 2,  ...props }) => {
  const {user} = useAuth();
  const {isConnected} = useSocket()

  return (
    <div className="relative w-min">
      {/* <div className={`w-2 aspect-square rounded-full  absolute -top-0 right-0 ${isConnected ? "bg-green-400" : "bg-rose-400"}`}></div> */}
      <div
       className={`aspect-square w-8 overflow-hidden bg-gray-600 rounded-full`}
        style={{width: `${width}rem`}}
      
      >
        {
         user && (
          <img
      
          src={ user && user.avatar && user.avatar.imageUrl}
          className={`h-full w-full transition duration-300 ${props.className || ""}`}
          // alt={"user profile"}
        />
         )
        }
      </div>
    </div>
  );
};

export default Avatar;
