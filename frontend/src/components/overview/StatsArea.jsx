import { useEffect, useState } from "react";
import StatsCard from "../business/StatsCard";
import { Users, UserPlus, Activity } from "lucide-react";
import { challengeStatistics, userStatistics } from "../../services";

const StatsArea = () => {
    const [challengeStats, setChallengeStats] = useState(null);
    const [userStats, setUserStats] = useState(null);
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const [resp, response] = await Promise.all([
          challengeStatistics(),
          userStatistics(),
        ]);
        setChallengeStats(resp.data)
        setUserStats(response.data)
      } catch (e) {
        console.log(e.message);
      }
    };
    fetchStatistics();
  }, []);
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title={"Total Users"}
        count={userStats && userStats.totalUsers || 0}
        icon={ Users}
        color={"text-green-600"}
      />
      <StatsCard
        title={"New Users"}
        count={userStats && userStats.newUsers || 0}
        icon={ UserPlus}
        color={"text-blue-600"}
      />
      <StatsCard
        title={"Total challenges"}
        count={challengeStats && challengeStats.totalChallenges || 0}
        icon={Activity}
        color={"text-yellow-600"}
      />
      <StatsCard
        title={"Active challenges"}
        count={challengeStats && challengeStats.activeChallenges || 0}
        icon={Activity}
        color={"text-rose-600"}
      />
    </div>
  );
};

export default StatsArea;
