import { CircleCheckBig, Footprints, HeartPulse, Flame } from 'lucide-react'
import StatsCard from '../business/StatsCard'
import { useEffect, useState } from 'react'
import { getUserChallengeSummary } from '../../services'
import {useAuth} from "../../context/authProvider"
import { getWholeNumber } from '../../utils'



const CHALLENGE_STATS = [
    {
        title:"Challenges completed",
        icon: CircleCheckBig,
        color: "text-green-600",
        total:4
    },
    {
        title:"Steps taken",
        icon: Footprints,
        color: "fill-amber-600 text-amber-600",
        total:4324

    },
    {
        title:"Average Heart rate",
        icon: HeartPulse,
        color: " text-red-600",
        total:40

    },
    {
        title:"Calories burned",
        icon: Flame,
        color: "fill-yellow-600 text-rose-600",
        total:879

    },
]
const StatsArea = ({analytics, data, isLoading}) => {
const {user} = useAuth()

  return (
 <section className="grid gap-4 sm:grid-cols-2">

            <StatsCard
              title={"Challenges completed"}
              count={data && data.challengesCompleted[0] && data.challengesCompleted[0]["total"] || 0}
              icon={CircleCheckBig}
              color={"text-green-600 "}
            />
            <StatsCard
              title={"Steps taken"}
              count={analytics && analytics.steps || 0}
              measurement={"steps"}
              icon={Footprints}
              color={"fill-amber-600 text-amber-600"}
            />
            <StatsCard
              title={"Total Heart rate"}
              count={getWholeNumber(!isLoading && analytics && analytics.heartRate || 0)}
              measurement={"bpm"}
              icon={HeartPulse}
              color={" text-red-600"}
            />
            <StatsCard
              title={"Calories burned"}
              count={`${getWholeNumber(!isLoading && analytics && analytics.calories || 0)}`}
              measurement={"kcal"}
              icon={Flame}
              color={"fill-yellow-600 text-rose-600"}
            />
          </section>
  )
}
export default StatsArea