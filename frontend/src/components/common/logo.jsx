import { Link } from 'react-router-dom';
import logoImage from '/icons/sprint.svg'
const Logo = () => {
  return (
    <Link
    to="/"
    className='sm:flex gap-3'>
      <div className="w-8 aspect-square shadow-violet-600 shadow-md rounded-full flex  justify-center items-center">
          <img src={logoImage} alt="person sprinting icon" width={24} height={24} />
      </div>
      <span className="text-2xl font-bold italic text-violet-600">
          Fit track
        </span>
    </Link>
  );
};

export default Logo;
