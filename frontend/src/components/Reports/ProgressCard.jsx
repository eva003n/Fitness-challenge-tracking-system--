import React from "react";

const ProgressCard = ({ title, children, isLoading }) => {
  return (
    <div className={`grid gap-4 min-h-[19.5rem] bg-slate-200 dark:bg-gray-800/20 dark:border-1 border-gray-700 rounded-md p-4 ${isLoading && "animate-pulse dark:bg-gray-800 "}`}>
      {
        !isLoading && (
          <div className="h-[296px]">
          <p className="text-[1.2rem] text-gray-700 dark:text-gray-400 ">{title}</p>
          {children}
          </div>
     
        )
      }
    </div>
  );
};

export default ProgressCard;
