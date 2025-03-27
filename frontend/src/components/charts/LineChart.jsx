import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
  } from "recharts";



const LineChartComponent = ({data}) => {

 
  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <LineChart data={data}>
        <XAxis dataKey={"date" }/>
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Calories" stroke="#FF4D4D" />
        <Line type="monotone" dataKey="Heartrate" stroke="#FF9800" />
        <Line type="monotone" dataKey="Distance" stroke="#4C9AFF" />
        <Line type="monotone" dataKey="Steps" stroke="#4CAF50" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
