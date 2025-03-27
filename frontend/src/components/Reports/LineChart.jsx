import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,  
    Tooltip,
    Legend,
    Label
  } from "recharts";
import { getWholeNumber } from "../../../utils";
  

const LineChartComponent = ({data, color}) => {
const formattedData = data && data.map(dataPoint => ({
    week: `Week ${dataPoint.week}`,
    total: getWholeNumber(dataPoint.total)
  }))


  return (
       <ResponsiveContainer width={"100%"} height={"100%"}>
         <LineChart data={formattedData && formattedData}>
           <XAxis dataKey={"week" }>
           <Label value="Total per week" offset={-5} position="insideBottom" />
           </XAxis>
           <YAxis>
            ,<Label value={"Total"} angle={-90} position="insideLeft" offset={0}/>
           </YAxis>
           <Tooltip />
           <Legend />
           <Line type="monotone" dataKey="total" stroke={color} />
         </LineChart>
       </ResponsiveContainer>
  )
}

export default LineChartComponent