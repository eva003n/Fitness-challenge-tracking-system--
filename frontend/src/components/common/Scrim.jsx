import { useEffect, useState } from "react";
import Button from "./Button";
import { X } from "lucide-react";
import Loader from "./Loader";
import {  motion } from "motion/react";
const Scrim = ({children, onShow, isLoading, ...props}) => {
useEffect(() => {
  return () => {
    return children = null;
  };
}, []);  
  

  return (
    <motion.div
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    exit={{opacity: 0}}
transition={{duration:0}}

    
    className={`fixed flex items-center justify-center inset-0 z-50 bg-black/50 text-white  ${props.className}`} >
        <Button
        className="absolute flex items-center justify-center top-2 right-2 cursor-pointer   rounded-full  aspect-square "
        onClick={onShow}
      icon={X}
        >
            
        </Button>
<motion.div
initial={{opacity: 0, y:0}}
animate={{opacity: 1, y: 6}}
transition={{duration: .3}}
className=" flex items-center justify-center "
// className="w-[90%] max-w-[25rem]"
>
{isLoading? <Loader/>:children}
</motion.div>
      
    </motion.div>
  );
};

export default Scrim;
