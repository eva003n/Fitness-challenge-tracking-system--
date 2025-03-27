import { useState } from "react";
const CheckBox = () => {
    const [isChecked, setIsChecked] = useState(false);
    const handleCheck = () => {
      setIsChecked(!isChecked);
      console.log("hello")
    }

  return <input 
  type="checkbox" 
  className="w-4 peer-checked:bg-violet-600  aspect-square" 
  
  checked={isChecked} 
  onChange={handleCheck}
  />;
};

export default CheckBox;
