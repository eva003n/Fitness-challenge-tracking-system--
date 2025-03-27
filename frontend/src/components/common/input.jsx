import React from "react";

const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className={`relative w-full`}>
   {Icon && <Icon size={18} className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400 " strokeWidth={2}/>}
      <input {...props} 
       className={`dark:border:none w-full rounded-sm bg-gray-200 dark:bg-slate-700 py-1.5 dark:disabled:bg-slate-800 disabled:bg-slate-100 text-gray-700  outline-none  dark:text-gray-300 dark:outline-gray-600  ${props.className}`}
      />
    </div>
  );
};

export default Input;
