import  Container  from '../../components/common/Container'
import { useState, useEffect } from 'react';
import List from '../../components/common/List';
import ListItem from '../../components/common/ListItem';
import Loader from '../../components/common/Loader';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Bookmark } from 'lucide-react';
import ProgressBar from '../../components/common/ProgressBar';
import { bookmarkChallenge, getAllChallenges } from '../../services';
import { getDateDifference, getDateByDay } from '../../services/formatDate';
import { toast } from 'react-toastify';
import HeaderTop from '../../components/common/headerTop';


const checkBookmarked = (challengeId, bookmarks) => bookmarks.some(bookmark => bookmark._id === challengeId)

const Explore = () => {
    const [challenges, setChallenges] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [bookmarks, setBookmarks] = useState(() => {
        return JSON.parse(localStorage.getItem("bookmarks")) || []
    })
    const [paginate, setPaginate] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
    
        
      })


    useEffect(() => {
        const fetchChallenges = async () => {    
            try {
                setIsLoading(true)
                const response = await getAllChallenges(paginate.page, paginate.limit);
           if(response.success) {
            setChallenges(response.data.challenges)
            setPaginate(response.data.pagination)
            setIsLoading(false)
           }

        }catch (e) {
            console.log(e.message);
        }finally {
            setIsLoading(false)
        }
    }
    fetchChallenges();
    }, []);

    const handleStreaks = () => {
        console.log("Streaks")
    }
    const handleBookmark = async (challengeId) => {
       try {
         const response = await bookmarkChallenge(challengeId)
         if(response.success) {
            //local bookmark state to store id of bookmarkled challenges
         const newBookmarks = [...bookmarks, {
            _id: challengeId
         }]
         setBookmarks(newBookmarks)
         localStorage.setItem("bookmarks", JSON.stringify(newBookmarks)) 
             toast.info(response.message)
         }
       } catch (e) {
        console.error(e.message)
        
       }



    }
  return (
   <Container>
    <HeaderTop
    title="Explore"
    />
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
                key={challenge._id}
              >
                <div className="grid gap-4">
                  <div className="flex items-center justify-between text-gray-400">
                    <div className="flex justify-between">
                      <div className="flex gap-4 text-[12px] text-gray-400">
                        <p>Workout</p>
                        <span className="text-1xl font-extrabold text-violet-700">
                          {challenge.workOutType}
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-500">
                      <div className="flex items-center gap-2 text-[.6rem]">
                        <p>Starts:</p>
                        <span className="font-medium">
                          {getDateByDay(challenge.startDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[.6rem]">
                        <p>Starts:</p>
                        <span className="font-medium">
                          {getDateByDay(challenge.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="h-38 overflow-hidden rounded-md bg-gray-900">
                    {challenge.image.imageUrl && (
                      <img
                        src={challenge.image.imageUrl || ""}
                        alt={challenge.workOutType}
                        className="h-38"
                      />
                    )}
                  </div>

                  <div className="flex justify-between">
                    <div className="grid gap-2">
                      <p className="text-[1.2rem] text-gray-100">
                        {challenge.challengeName}
                      </p>
                      <p className="text-[14px] text-gray-400">
                        {challenge.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between text-[12px] text-gray-400">
                    <div className="flex items-center gap-2">
                      <p>Duration:</p>
                      <span className="text-[1rem] font-medium">
                        {getDateDifference(challenge.endDate, challenge.startDate)} days
                      </span>
                    </div>

                    {challenge.status === "In progress" && (
                      <div className="flex items-center gap-2">
                        <p>Remaining: </p>
                        <span className="text-[1rem] font-medium text-rose-700">
                          {getDateDifference(
                            challenge.endDate
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
                        {challenge.status}
                      </span>
                    </div>
                  </div>
                  {/* <div className="flex gap-1 text-gray-400">
                    <Link
                      to={`/challenges/challenge/${challenge._id}`}
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
                  </div> */}
                  {/* <ProgressBar count={challenge.Challenges.completion} /> */}

                  <div className="flex justify-end">
                  <Button
                  icon={Bookmark}
                  onClick={() => handleBookmark(challenge._id)}
                //   className="fill-violet-300"
                  className={`${checkBookmarked(challenge._id, bookmarks) ? "fill-violet-600 " : ""} `}
                  />
                  </div>
                </div>
              </ListItem>
            );
          })}
      </List>
   </Container>
  )
}

export default Explore