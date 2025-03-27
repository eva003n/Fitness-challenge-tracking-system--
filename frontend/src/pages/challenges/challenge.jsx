import { useEffect, useState } from "react";
// import { getChallengeData } from "../../services";
import { useParams } from "react-router-dom";

import {
  createActivity,
  getActivityByChallange,
  getChallengeAnalysis,
  getChallengeData,
  updateActivity,
  deleteActivity,
  getActivity,
  updateStreaks,
} from "../../services";
import Select from "../../components/common/Select";

import { toast } from "react-toastify";
import { Plus, Loader2 } from "lucide-react";
import Input from "../../components/common/input";
import Button from "../../components/common/Button";
import Scrim from "../../components/common/Scrim";
import Label from "../../components/common/label";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import StatsCard from "../../components/business/StatsCard";
import {
  getDateByDay,
  getDateByMonth,
  getDateByYear,
  getDateDifference,
} from "../../services/formatDate";
import Analytics from "../../components/Challenges/Analytics";
import { motion } from "motion/react";
import Container from "../../components/common/Container";
import { useSocket } from "../../context/socket.io/socketContext";

const TABLEDATA = [
  {
    activity: "Hackathon",
    _id: 123,
    challengeId: "123",
    workout: "cycling",
    calories: 0,
    heartRate: 0,
    distanceCovered: 0,
    reps: 0,
    weightLifted: 0,
    stepsCount: 0,
    duration: 1.7,
    status: "In progress",
    date: "26/02/2025",
  },
  {
    activity: "Hackathon",
    challengeId: "456",
    _id: 456,
    workout: "cycling",
    calories: 0,
    heartRate: 0,
    distanceCovered: 0,
    reps: 0,
    weightLifted: 0,
    stepsCount: 0,
    duration: 3,
    status: "In progress",
    date: "26/02/2025",
  },
  {
    activity: "cyclic",
    challengeId: "789",
    _id: 769,
    workout: "cycling",
    calories: 0,
    heartRate: 0,
    distanceCovered: 0,
    reps: 0,
    weightLifted: 0,
    stepsCount: 0,
    duration: 7,
    status: "In progress",
    date: "28/2/2025",
  },
  {
    activity: "Mongo",
    challengeId: "231",
    _id: 97,
    workout: "cycling",
    calories: 0,
    heartRate: 0,
    distanceCovered: 0,
    reps: 0,
    weightLifted: 0,
    stepsCount: 0,
    duration: 5,
    status: "In progress",
    date: "21/2/2025",
  },
  {
    activity: "Mongo",
    challengeId: "231",
    _id: 87,
    workout: "cycling",
    calories: 0,
    heartRate: 0,
    distanceCovered: 0,
    reps: 0,
    weightLifted: 0,
    stepsCount: 0,
    duration: 5,
    status: "In progress",
    date: "21/2/2025",
  },
  {
    activity: "Mongo",
    challengeId: "231",
    _id: 27,
    workout: "cycling",
    calories: 0,
    heartRate: 0,
    distanceCovered: 0,
    reps: 0,
    weightLifted: 0,
    stepsCount: 0,
    duration: 5,
    status: "In progress",
    date: "21/2/2025",
  },
  {
    activity: "Mongo",
    challengeId: "231",
    _id: 997,
    workout: "cycling",
    calories: 0,
    heartRate: 0,
    distanceCovered: 0,
    reps: 0,
    weightLifted: 0,
    stepsCount: 0,
    duration: 5,
    status: "In progress",
    date: "21/2/2025",
  },
  {
    activity: "Mongo",
    challengeId: "231",
    _id: 947,
    workout: "cycling",
    calories: 0,
    heartRate: 0,
    distanceCovered: 0,
    reps: 0,
    weightLifted: 0,
    stepsCount: 0,
    duration: 5,
    status: "In progress",
    date: "21/2/2025",
  },
  // {
  //   activity: "Mongo",
  //   challengeId: "231",
  //   _id: 917,
  //   workout: "cycling",
  //   calories: 0,
  //   heartRate: 0,
  //   distanceCovered: 0,
  //   reps: 0,
  //   weightLifted: 0,
  //   stepsCount: 0,
  //   duration: 5,
  //   status: "In progress",
  //   date: "21/2/2025",
  // },
];
const TABLE_HEADERS = [
  "No",
  "Activity",
  "Workout",
  "Calories",
  "Heart rate",
  "Distance",
  "Steps",
  "Date",
  "Action",
];

const paginate = (data, startIndex) =>
  data.map((data, index) => {
    if (index >= startIndex && index <= startIndex + 10) {
      return data;
    }
    return "";
  });
const completedActivities = (activities) =>
  activities.reduce((acc, activity) => {
    if (activity.status === "Completed") return acc + 1;

    return acc;
  }, 0);
// console.log(completedActivities(TABLEDATA))
const calculatePercentage = (completedActivities, totalActivities) => {
  if (completedActivities && totalActivities)
    return Math.floor((completedActivities / totalActivities) * 100);
  return 0;
};

const filterActivities = (activities, query) => {
  query.toString().toLowerCase();
  return activities.filter((activity) => {
    return (
      activity.activity
        .split(" ")
        .some((word) => word.toLowerCase().startsWith(query)) ||
      activity.workout
        .split(" ")
        .some((word) => word.toLowerCase().startsWith(query))
    );
  });
};
const Challenge = () => {
  const { id } = useParams();
  const { socket } = useSocket();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalActivities: 0,
    totalCompleted: 0,
    percentage: 0,
    daysLeft: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(4);
  const [isUpdate, setisupdate] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const [data, setData] = useState({
    activity: "",
    challengeId: id,
    userId: user._id,
    workout: "",
    calories: 0,
    heartRate: 0,
    distanceCovered: 0,
    reps: 0,
    weightLifted: 0,
    stepsCount: 0,
    duration: 0,
    date: "",
    status: "",
    daysLeft: "",
  });

  useEffect(() => {
    const challengeProgress = async () => {
      try {
        const response = await getChallengeAnalysis(id);

        if (response.success) {
          // setData({
          //   ...data,
          //   daysLeft: getDateDifference(resp.data.endDate),
          // });
          setActivities(response.data.workouts);
          setAnalytics({
            totalActivities: response.data.totalActivities,
            totalCompleted: response.data.totalCompleted,
            percentage: response.data.percentage,
            daysLeft: getDateDifference(response.data.challenge.endDate),
          });
        }
      } catch (e) {
        console.log(e);
      }
    };
    challengeProgress();
  }, [isSubmit]); //fetch new activity data
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const handleShow = () => {
    isOpen ? setIsOpen(false) : setIsOpen(true);
  };

  const handleFilter = (e) => {
    setSearchText(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsLoading(true);
      const response = !isUpdate
        ? await createActivity(data)
        : await updateActivity(data._id, data);

      if (response.success) {
        setIsLoading(false);
        toast.info(response.message);
        //causethe use effect to re-render and set updated data
        setIsSubmit(() => true);
      }
    } catch (e) {
      setIsLoading(false);
      toast.error(e.message);
      console.log(e);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      const response = await deleteActivity(activityId);
      if (response.success) {
        toast.info(response.message);
        setActivities(
          activities.filter((activity) => activity._id !== activityId)
        );
        setIsSubmit(() => true);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };
  const handleEdit = async (activityId) => {
    try {
      const response = await getActivity(activityId);
      if (response.success) {
        setisupdate(true);
        setData(response.data);
        setIsOpen(true);
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const handleCompleted = async (activityId) => {
    try {
      const response = await updateActivity(activityId, {
        status: "Completed",
        challengeId: id,
      });

      if (response.success) {
        setActivities(
          activities.filter((activity) => {
            if (
              activity._id === activityId &&
              activity.status === "In progress"
            ) {
              return (activity.status = "Completed");
            }
            return activity;
          })
        );
        toast.info(response.message);
        setIsSubmit(true);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handlePaginate = (index) => {
    setStartIndex(index);
    setEndIndex(index + 4);

    setActivities(activities);
  };
  const handleStreaksUpdate = async () => {
    await updateStreaks(user._id);
  };
  return (
    <Container>
      <motion.div>
        {<Analytics analytics={analytics} />}

        {/* {!isLoading && ( */}
        <div className="my-4 flex w-full justify-end">
          <Button
            icon={Plus}
            className="bg-violet-600 text-white"
            name={"Activity"}
            onClick={() => setIsOpen(true)}
          />
        </div>

        {
          <DataTable
            tableData={paginate(
              filterActivities(activities, searchText),
              startIndex
            )}
            handleFilter={handleFilter}
            handleDeleteActivity={handleDeleteActivity}
            handleCompleted={handleCompleted}
            searchText={searchText}
            startIndex={startIndex}
            endIndex={endIndex}
            handlePaginate={handlePaginate}
            handleEdit={handleEdit}
            handleStreaks={handleStreaksUpdate}
            setIsSubmit={setIsSubmit}
            tableHeaders={TABLE_HEADERS}
          />
        }
        {isOpen && (
          <Scrim onShow={handleShow}>
            <form
              onSubmit={(e) => handleSubmit(e)}
            className="grid w-[20rem] max-w-[25rem] gap-1 bg-gray-800 p-4"
            >
              <h2 className="text-center font-medium text-gray-300">
                {isUpdate ? "Update Activity" : "Add Activity"}
              </h2>
              <Label name={"Activity name"} />
              <Input
                type="text"
                name={"activity"}
                value={data.activity}
                className="px-2"
                onChange={handleChange}
                required
              />
              <Label name={"Workout"} />
              <Input
                type="text"
                name={"workout"}
                value={data.workout}
                className="px-2"
                onChange={handleChange}
                required
              />
              {/* <Select
                value={data.workout}
                name="workout"
                onChange={handleChange}
                // disable= {"true"} 
              >
                <option value="Running">Running</option>
                <option value="Walking">Walking</option>
                <option value="Strength training">Strength training</option>
                <option value="Cycling">Cycling</option>
              </Select> */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-4">
                  <Label name={"Calories"} />
                  <Input
                    type="number"
                    name="calories"
                    className="w-5 px-2"
                    value={data.calories}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Label name={"Heart rate"} />
                  <Input
                    type="number"
                    name="heartRate"
                    className="w-5 px-2"
                    value={data.heartRate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Label name={"Distance"} />
                  <Input
                    type="number"
                    name="distanceCovered"
                    className="w-5 px-2"
                    value={data.distanceCovered}
                    onChange={handleChange}
                    onClick={(e) => e.preventDefault()}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex grow flex-col gap-2">
                  <Label name={"Steps taken"} />
                  <Input
                    type="number"
                    name="stepsCount"
                    className="px-2"
                    value={data.stepsCount}
                    onChange={handleChange}
                  />
                </div>
                {isUpdate && (
                  <div className="flex flex-col gap-2">
                    <Label name={"Status"} />
                    <Input
                      type="text"
                      name="status"
                      className="px-2"
                      value={data.status}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
              <Label name={"Date"} />
              {isUpdate && console.log(getDateByMonth(data.date))}
              <Input
                type="date"
                name="date"
                className="px-2"
                // value={isUpdate? getDateByMonth(data.date): data.date}
                value={isUpdate ? getDateByYear(data.date) : data.date}
                onChange={handleChange}
                required
              />
              <Button
                name={
                  !isUpdate
                    ? isLoading
                      ? "Creating"
                      : "Create"
                    : isLoading
                      ? "Updating"
                      : "Update"
                }
                className="w-full bg-violet-600 text-white"
                icon={isLoading && Loader2}
                loader={true}
                isLoading={isLoading}
                // onClick={() => setIsOpen(false)}
                onClick={handleStreaksUpdate}
              />
            </form>
          </Scrim>
        )}
      </motion.div>
    </Container>
  );
};

export default Challenge;
