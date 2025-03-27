import { useParams } from "react-router-dom";
import Input from "../../components/common/input";
import Label from "../../components/common/label";
import { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import { getActivity, updateActivity } from "../../services";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import Container from "../../components/common/Container";
import { getDateByMonth, getDateByYear } from "../../services/formatDate";

const INPUTS = [
  {
    label: "Activity",
    name: "activity",
    type: "text",
  },
];

const ActivityUpdate = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    activity: "",
    challengeId: "",
    workout: "",
    calories: 0,
    heartRate: 0,
    distanceCovered: 0,
    reps: 0,
    weightLifted: 0,
    stepsCount: 0,
    duration: 0,
    status: "",
    date: "",
  });

  useEffect(() => {
    const getActivityData = async () => {
      const response = await getActivity(id);
      try {
        if (response.success) {
          setData(response.data);
          console.log(response.data);
        }
      } catch (e) {
        console.log(e);
      }
    };

    getActivityData();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name + " " + value);
    setData({
      ...data,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const response = await updateActivity(id, data);
      if (response.success) {
        toast.info(response.message);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e.message);
      setIsLoading(false);
    }
  };
  return (
    <Container>
      <form
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-[56rem] gap-4 rounded-lg bg-gray-100 px-4 py-8 text-violet-700 md:grid-cols-2 dark:bg-slate-800"
      >
        <div className="grid gap-2">
          <Label
            htmlFor="activity"
            name="Activity name"
            className="text-gray-400"
          />
          <Input
            type="text"
            name="activity"
            value={data.activity}
            className="px-3"
            onChange={handleChange}
          />
          <Label
            htmlFor="activity"
            name="Calories burned"
            className="text-gray-400"
          />
          <Input
            type="number"
            name="calories"
            value={data.calories}
            onChange={handleChange}
            className="px-3"
          />
          <Label
            htmlFor="distanceCovered"
            name="Distance covered"
            className="text-gray-400"
          />
          <Input
            type="number"
            name="distanceCovered"
            value={data.distanceCovered}
            onChange={handleChange}
            className="px-3"
          />
          <Label
            htmlFor="activity"
            name="Weight lifted"
            className="text-gray-400"
          />
          <Input
            type="number"
            name="weightLifted"
            value={data.weightLifted}
            onChange={handleChange}
            className="px-3"
          />
          <Label
            htmlFor="Heart rate"
            name="Heart rate"
            className="text-gray-400"
          />
          <Input
            type="number"
            name="heartRate"
            value={data.heartRate}
            onChange={handleChange}
            className="px-3"
          />
        </div>
        <div className="grid gap-2">
          <Label
            htmlFor="activity"
            name="Steps count"
            className="text-gray-400"
          />
          <Input
            type="number"
            name="stepsCount"
            value={data.stepsCount}
            onChange={handleChange}
            className="px-3"
          />
          <Label htmlFor="status" name=" Status" className="text-gray-400" />
          <Input
            type="text"
            name="status"
            value={data.status}
            onChange={handleChange}
            className="px-3"
          />
          <Label
            htmlFor="reps"
            name="Number of reps"
            className="text-gray-400"
          />
          <Input
            type="number"
            name="reps"
            value={data.reps}
            onChange={handleChange}
            className="px-3"
          />
          <Label
            htmlFor="duration"
            name="Duration hrs"
            className="text-gray-400"
          />
          <Input
            type="number"
            name="duration"
            value={data.duration}
            onChange={handleChange}
            className="px-3"
          />
          <Label htmlFor="Date" name="Date" className="text-gray-400" />
          <Input
            type="date"
            name="date"
            value={getDateByYear(data.date)}
            onChange={handleChange}
            className="px-3"
          />
          <div>
            <Button
              name={isLoading ? "Updating..." : "Update"}
              icon={isLoading && Loader}
              isLoading={isLoading}
              loader={true}
              className="float-right bg-violet-600 tracking-wide text-white sm:w-min"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* <div className="col-start-2 flex justify-end">
          
        </div> */}
      </form>
    </Container>
  );
};

export default ActivityUpdate;
