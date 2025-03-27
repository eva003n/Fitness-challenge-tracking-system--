import CheckBox from "../components/common/checkbox";
import { useEffect, useState } from "react";
import DataTable from "../components/common/DataTable";
import { getAllActivities } from "../services";
import Loader from "../components/common/Loader";

const Activity = () => {
  const [activityData, setActivityData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getActivities = async () => {
      try {
        setIsLoading(true);
        const response = await getAllActivities();

        setActivityData(response.data);
        setIsLoading(() => false);
      } catch (e) {
        setIsLoading(false);

        // console.log(e.response.error);
        // console.log(e.message);
      }
    };

    // getActivities();
  }, []);

  // const parseDate = dayjs(setActivityData[0].createdAt).format("DD-MM-YYYY HH:mm:ss")
  // console.log(parseDate)
  return (
    <section className="mx-auto my-2 max-w-[65rem] p-6 text-white">
      {isLoading ? (
        <Loader className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-100" />
      ) : (
        <DataTable tableData={activityData || []} />
      )}
    </section>
  );
};

export default Activity;
