import logoImage from '/icons/sprint.svg'
const Logo = () => {
  return (
    <div className='md:flex gap-3'>
      <div className="w-8 aspect-square  dark:shadow-violet-600 shadow-md shadow-white rounded-full flex  justify-center items-center">
          <img src={logoImage} alt="person sprinting icon" width={24} height={24} />
      </div>
      <span className="text-2xl font-bold italic text-violet-600">
          Fit track
        </span>
    </div>
  );
};

export default Logo;
