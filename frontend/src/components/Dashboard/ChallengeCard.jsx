import ListItem from "../common/ListItem";
import List from "../common/List";
import { motion } from "motion/react";
import ProgressBar from "../common/ProgressBar";
import { getDateDifference } from "../../services/formatDate";
const CHALLENGE_DATA = [
  {
    title: "Daily jogging",
    dueDate: "2025-03-01",
    duration: 10,
  },
  {
    title: "30 days of running",
    dueDate: "2025-04-01",
    duration: 25,
  },
  {
    title: "1000 steps a day",
    dueDate: "2025-03-16",
    duration: 16,
  },
];
const ChallengeCard = ({ analytics, isLoading }) => {
  return (
    <List
      className={`flex h-full max-w-[30rem] flex-col gap-4 bg-gray-800/50 p-4 text-gray-600 dark:text-gray-200`}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          {!isLoading && (
            <h2 className="text-1xl font-bold text-gray-600 dark:text-gray-200">
              Current challenges
            </h2>
          )}
        </div>
        {/* {analytics && !analytics.length && (
        <div className="h-full flex  justify-self-center">
          <p className="text-gray-400">No challenges yet</p>
        </div>

      )} */}
      </motion.div>

      {analytics &&
        analytics.map((challenge) => (
          <motion.li
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            key={challenge._id}
            className="rounded-lg bg-slate-200 p-4 dark:bg-gray-900"
          >
            <div className="flex justify-between">
              <p className="text-gray-400">{challenge.name}</p>
              <p className="text-rose-700">{`Due in -${getDateDifference(challenge.endDate)} days`}</p>
            </div>
            <ProgressBar count={challenge.completion || 0} />
          </motion.li>
        ))}
    </List>
  );
};

export default ChallengeCard;
