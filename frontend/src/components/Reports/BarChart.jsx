import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, Label } from "recharts"
import {getWholeNumber} from "../../../utils/index"
const DATA = [
    {
      "name": "Day 1",
      "uv": 4000,
      
    },
    {
      "name": "Day 2",
      "uv": 3000,
      
    },
    {
      "name": "Day 3",
      "uv": 2000,
      
    },
    {
      "name": "Day 4",
      "uv": 2780,
      
    },
    {
      "name": "Day 5",
      "uv": 1890,
      
    },
    {
      "name": "Day 6",
      "uv": 2390,
      
    },
    {
      "name": "Day 7",
      "uv": 3490,
      
    }
  ]

  
  


const BarChartComponent = ({data}) => {
  const formattedData = data && data.map(dataPoint => ({
    week: `Week ${dataPoint.week}`,
    total: getWholeNumber(dataPoint.total)
  }))

 
  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
    <BarChart data={formattedData}>
    
    <XAxis dataKey="week">
    <Label value="Total per weeks" offset={0} position="insideBottom" />
    </XAxis>
    <YAxis label={{ value: 'Total', angle: -90, position: 'insideLeft' }} />
    <Tooltip />
    <Legend />
    <Bar dataKey="total" className="fill-violet-600 text-gray-400" />
    {/* <Bar dataKey="uv" fill="#82ca9d" /> */}

    </BarChart>
    
    </ResponsiveContainer>
  )
}

export default BarChartComponent