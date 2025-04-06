import { useEffect } from "react";
import StatsCard from "../business/StatsCard";
import { getChallengeAnalysis } from "../../services";
import { SquareActivity } from "lucide-react";

import { getWholeNumber } from "../../utils";
const Analytics = ({ id, analytics  }) => {



  useEffect(() => {
   const getAnalyTics = async () => {
      const response = await getChallengeAnalysis(id);
      if (response.success) {  
        setAnalytics(response.data);

      }
    };
    // getAnalyTics()
  }, []);
  return (
    <div className="grid gap-4 md:grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] ">
{
        <>

        <StatsCard
          title={analytics.daysLeft <= 0 ? "Overdue" : "Days left"}
          count={`${analytics.daysLeft || 0} days `}
          icon={SquareActivity}
          color={ analytics.daysLeft <= 0 ? " text-rose-600": "text-violet-600"}
        />
        <StatsCard
          title={"Completion"}
          count={`${getWholeNumber(analytics.percentage)}%`}
          icon={SquareActivity}
          color={" text-violet-600"}
        />
        <StatsCard
          title={"Total activities"}
          count={analytics.totalActivities }
          icon={SquareActivity}
          color={" text-violet-600"}
        />
        <StatsCard
          title={"Total completed"}
          count={analytics.totalCompleted}
          icon={SquareActivity}
          color={" text-violet-600"}
        />
      </>
}
    </div>
  );
};

export default Analytics;
