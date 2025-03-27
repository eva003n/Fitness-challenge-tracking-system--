
import Input from './input'
import { Search } from 'lucide-react';

const SearchBar = ({value, onChange,...props}) => {
  return (
    <div className={`w-full max-w-[${props.width || 30}rem]  bg-white rounded-lg ${props.className || ""}`}>
    <Input icon={Search}
    className="pl-10 dark:bg-gray-900 text-gray-400"
   placeholder={props.placeholder || ""}
   value={value}
   onChange={onChange}
   />
  </div>
       

  )
}

export default SearchBar
