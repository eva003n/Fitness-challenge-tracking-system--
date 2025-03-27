const Label = ({ name, htmlFor, icon: Icon, ...props }) => {
  return (
    <label

      htmlFor={htmlFor}
      className={`font-medium text-gray-600 dark:text-gray-400 ${props.className || ""}`}
    >
      {Icon && <Icon size={18} />}
      {name}
      {props.children}
    </label>
  );
};

export default Label;
