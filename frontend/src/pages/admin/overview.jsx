import Container from "../../components/common/Container";
import HeaderTop from "../../components/common/headerTop";
import Wrapper from "../../components/common/Wrapper";


import {  useEffect } from "react";
import StatsArea from "../../components/overview/StatsArea";
import WorkoutTrends from "../../components/overview/WorkoutTrends";
import ChallengeRate from "../../components/overview/ChallengeRate";

const Overview = () => {
  return (
    <Container>
      <Wrapper>
        <div>
          <HeaderTop title={"Dashboard"} />
        </div>
        <StatsArea />
        <div className="mt-10 grid justify-between gap-5 sm:grid-cols-2">
          <ChallengeRate />
          <WorkoutTrends />
        </div>
      </Wrapper>
    </Container>
  );
};

export default Overview;
