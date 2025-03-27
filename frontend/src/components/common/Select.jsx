

const Select = ({value, onChange, disable, name, children, props }) => {

  return (
   
    <select 
    value={value} 
    onChange={onChange}
    name={name}
    className={`text-gray-400  py-2 px-4 w-full disabled:bg-gray-800 bg-slate-200 dark:bg-slate-800 rounded-md outline-1 outline-slate-700`} 
    autoComplete="off"
disabled={disable}
   >
    {children}

    </select>
  );
};

export default Select;
