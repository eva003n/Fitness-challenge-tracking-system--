import { motion } from "motion/react";

const StatsCard = ({ icon: Icon, title, color, ...props }) => {
  return (
    <motion.div 
    initial={{y: 20, opacity: 0}}
    animate={{y: 0, opacity: 1}}
    transition={{duration: 0.5}}
    className="grow">
     <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-100  p-4 dark:bg-gray-800/50 dark:text-gray-300">
    {Icon && <Icon size={24}  className={color}  />}
    <div 
    className="grow">
      <p>{title}</p>
      <p className="text-3xl font-medium  flex items-center gap-1 ">
      {props.count}
        <span className="text-[.8rem] italic font-bold text-gray-500">
          {props.measurement || ""}
        </span>
      </p>
    </div>
  </div>
    </motion.div>
 
  );
};
/**
  <motion.div 
      initial={{y: 20, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      transition={{duration: 0.5}}
      className="grow">
        <p>{title}</p>
        <span className="text-3xl font-medium text-gray-200">
          {props.count}
        </span>
      </motion.div>
 */
export default StatsCard;
