
const Loader = ({ ...props }) => {

    

  return (
    /* From Uiverse.io by devAaus */
    <div 
    className={ `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  ${props.className}`}
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="flex h-20 w-20 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-blue-400 text-4xl text-violet-400">
          <div className="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-red-400 text-2xl text-red-400"></div>
        </div>
      </div>
      <p className="text-gray-200">{props.process}</p>
    </div>
  );
};

export default Loader;
