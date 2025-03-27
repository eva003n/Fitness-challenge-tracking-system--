const Button = ({ name, icon: Icon, loader, isLoading, children, ...props }) => {

  return (
    <button
      {...props}
      className={`flex cursor-pointer justify-center gap-2 rounded-sm px-3.5 py-1.5 font-medium text-gray-100 disabled:cursor-not-allowed disabled:opacity-80 dark:text-gray-200 ${props.className}`}
    >
      {Icon && <Icon size={18} strokeWidth={2} className={loader && isLoading && `animate-spin`} />
      }
      {name}
      {children}
    </button>
  );
};

export default Button;
