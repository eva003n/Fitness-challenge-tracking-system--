import { motion } from "motion/react";
import { getWholeNumber } from "../../utils";
const ProgressBar = ({ count }) => {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex w-full justify-between">
        <p className="text-gray-600 font-medium">Progress</p>
        <p className="text-gray-400 font-medium">{getWholeNumber(count)}%</p>
      </div>
      <div className="h-1 w-full rounded-full bg-gray-700">
        <motion.div
        initial={{width: 0}}
        animate={{width: `${getWholeNumber(count)}%`}}
        transition={{duration: .8}}
          className="h-1 rounded-full bg-linear-to-r/hsl from-violet-600 from-30% via-violet-500 via-50% to-violet-400 t0-75%"
          style={{ width: `${getWholeNumber(count)}%` }}
        ></motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;