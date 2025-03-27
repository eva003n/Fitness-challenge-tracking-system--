import { useEffect, useState } from "react"
import { getWorkoutSummary } from "../../services"
import { useAuth } from "../../context/authProvider"
import { motion } from "motion/react"
import PieChartCompoenent from "../charts/PieChart"
import { getWholeNumber } from "../../../utils/index"

const WorkoutsSummary = ({summary, isLoading}) => {
    const {user} = useAuth()
    const [data, setData] = useState(null)
     useEffect(() => {
         const getSummary = async () => {
            try {
                const response = await getWorkoutSummary(user._id)
                if(response.success){
                    const formattedData = response.data.map((dataPoint) => ({
                        workout: dataPoint.type,
                        value: getWholeNumber(dataPoint.percentagePerWorkout)
                    }))
   
                    setData(formattedData)
                }
            } catch (e) {
                console.log(e.message)
                
            }
         }
        //  getSummary()
     },[])

     const formattedData = summary && summary.map((dataPoint) => ({
      workout: dataPoint.type,
      value: getWholeNumber(dataPoint.percentagePerWorkout)
  }))


  return (
    <section className="flex flex-col gap-4 text-gray-400">
         <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 0.5 }}
           className="rounded-lg  p-4 "
         >
        
            <PieChartCompoenent  data={!isLoading && formattedData && formattedData.length > 0 && formattedData }/>
         
         </motion.div>

       </section>
  )
}

export default WorkoutsSummary