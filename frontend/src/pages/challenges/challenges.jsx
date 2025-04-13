import { useEffect, useState } from "react";

import { Plus, X, Binoculars } from "lucide-react";
import Button from "../../components/common/Button.jsx";

import { Trash2, Pen } from "lucide-react";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import {
  getAllUserChallenges,
  updateChallenge,
  updateStreaks,
} from "../../services/index.js";
import { deleteChallenge } from "../../services/index.js";
import List from "../../components/common/List.jsx";
import ListItem from "../../components/common/ListItem";
import ProgressBar from "../../components/common/ProgressBar";
import { getDateByDay } from "../../services/formatDate.js";
import Container from "../../components/common/Container.jsx";
import { useAuth } from "../../context/authProvider.js";
import HeaderTop from "../../components/common/headerTop.jsx";
import { getWholeNumber } from "../../utils/index.js";

const Challenges = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getChallenges = async () => {
      try {
        setIsLoading(true);
        const resp = await getAllUserChallenges(user._id);
        if (resp.success) {
          // toast.info(resp.message);
          setChallenges(resp.data || "");
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        if (error.code === "ERR_NETWORK")
          toast.error(`${error.message}, try again`);
        toast.error(error.message);
      }
    };
    getChallenges();
    // setIsOpen(false);
  }, []);

  const handleDeleteChallenge = async (challengeId) => {
    try {
      const resp = await deleteChallenge(challengeId);
      if (resp && resp.success) {
        handleDeleteBookmark(challengeId)
        setChallenges(
          challenges.filter(
            (challenge) => challenge.Challenges.challenge_id !== challengeId
          )
        );
        return toast.info(resp.message);
      }
    } catch (error) {
      // return toast.error(error.message);
    }
  };

  const handleShow = () => {
    isOpen ? setIsOpen(false) : setIsOpen(true);
    isLoading && setIsLoading(false);
  };

  const handleStreaks = async () => {
    await updateStreaks(user._id);
  };
  const handleDeleteBookmark = (id) => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    const newBookmarks = bookmarks.filter((bookmark) => String(bookmark._id) === String(id));
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
  }
  const handleStatusUpdate = async (challengeId, status) => {
    try {
      if (status === "Pending") {
        await updateChallenge(
          { status: "In progress", createdBy: user._id },
          challengeId
        );
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  return (
    <Container>
      <HeaderTop
      title={"My Challenges"}
      />
      {
        <div className="flex  flex-col items-center justify-between gap-4  z-100 fixed bottom-10 right-6">
          <Link to="/challenges/explore">
            <button
              className="flex aspect-square w-14 cursor-pointer items-center justify-center gap-0.5 rounded-full bg-violet-600 text-white shadow-sm shadow-black/50 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50"
              onClick={handleShow}
              title="Explore"
            >
              <Binoculars size={18} strokeWidth={2} />
              {/* Challenge */}
            </button>
          </Link>
          <Link to="/challenges/new">
            <button
              className=" flex aspect-square w-14 cursor-pointer items-center justify-center gap-0.5 rounded-full bg-violet-600 text-white shadow-sm shadow-black/50 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50"
              onClick={handleShow}
              title="New challenge"
            >
              <Plus size={18} strokeWidth={2} />
              {/* Challenge */}
            </button>
          </Link>
        </div>
      }
      {!isLoading && challenges && !challenges.length && (
        <div className="flex h-screen flex-col items-center justify-center gap-4 text-gray-400">
          <p>No Challenges yet</p>
          <Link to="/challenges/new">
            <Button
              className="bg-violet-600 text-white"
              name={"Create"}
            ></Button>
          </Link>
        </div>
      )}
      <List className="mx-auto grid max-w-[65rem] grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-4">
        {isLoading && (
          <Loader
            process="Loading challenges..."
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-100"
          />
        )}

        {challenges &&
          challenges.map((challenge) => {
            return (
              <ListItem
                className="rounded-lg dark:border-[.5px] border-gray-700 bg-slate-100 px-4 py-4 dark:bg-gray-800/10"
                key={challenge.Challenges.challenge_id}
              >
                <div className="grid gap-4">
                  <div className="flex items-center justify-between text-gray-400">
                    <div className="flex justify-between">
                      <div className="flex gap-4 text-[12px] text-gray-400">
                        <p>Workout</p>
                        <span className="text-1xl font-extrabold text-violet-700">
                          {challenge.Challenges.workOutType}
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-500">
                      <div className="flex items-center gap-2 text-[.6rem]">
                        <p>Starts:</p>
                        <span className="font-medium">
                          {getDateByDay(challenge.Challenges.startDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[.6rem]">
                        <p>Ends:</p>
                        <span className="font-medium">
                          {getDateByDay(challenge.Challenges.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="h-38 overflow-hidden rounded-md bg-gray-900">
                    {challenge.Challenges.image.imageUrl && (
                      <img
                        src={challenge.Challenges.image.imageUrl || ""}
                        alt={challenge.Challenges.workOutType}
                        className="h-38"
                      />
                    )}
                  </div>

                  <div className="flex justify-between">
                    <div className="grid gap-2">
                      <p className="text-[1.2rem] text-gray-100">
                        {challenge.Challenges.challengeName}
                      </p>
                      <p className="text-[14px] text-gray-400">
                        {challenge.Challenges.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between text-[12px] text-gray-400">
                    <div className="flex items-center gap-2">
                      <p>Duration:</p>
                      <span className="text-[1rem] font-medium">
                        {challenge.Challenges.duration.days} days
                      </span>
                    </div>

                    {challenge.Challenges.status === "In progress" && (
                      <div className="flex items-center gap-2">
                        <p>Remaining: </p>
                        <span className="text-[1rem] font-medium text-rose-700">
                          {getWholeNumber(
                            challenge.Challenges.duration.remainingDays
                          )}{" "}
                          days
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-4 text-[12px] text-gray-400">
                      <p>Status</p>
                      <span className="text-1xl font-extrabold text-green-600">
                        {challenge.Challenges.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 text-gray-400">
                    <Link
                      to={`/challenges/challenge/${challenge.Challenges.challenge_id}`}
                    >
                      <Button
                        className="flex gap-2 text-gray-400"
                        icon={Pen}
                        name={"Edit"}
                      />
                    </Link>
                    <Button
                      className="flex gap-2 text-gray-400"
                      onClick={() => {
                        return handleDeleteChallenge(
                          challenge.Challenges.challenge_id
                        );
                      }}
                      icon={Trash2}
                      name={"Delete"}
                    />
                  </div>
                  <ProgressBar count={challenge.Challenges.completion} />

                  <div className="flex justify-between">
                    <Link
                      to={`/challenges/${challenge.Challenges.challenge_id}`}
                      className="text-violet-600"
                      onClick={handleStreaks}
                    >
                      View more
                    </Link>
                    {/* <div>  
                  
                        <Button
                  onClick={() => handleStatusUpdate(challenge.Challenges.challenge_id, challenge.Challenges.status)}
                  // name={challenge.Challenges.completion !== 100? "Start" : "Continue"}
                  name={"Mark"}
                  className="bg-violet-600 text-gray-100 text-center"
                  
                  ></Button></div> */}
                  </div>
                </div>
              </ListItem>
            );
          })}
      </List>
    </Container>
  );
};
export default Challenges;
