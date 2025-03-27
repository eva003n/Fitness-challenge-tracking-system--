import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { getWholeNumber } from "../../../utils";
import { useEffect, useState } from "react";

const ACTIVITY_TOTALS = [
  {
    name: "Running",
    value: 5000,
  },
  {
    name: "Walking",
    value: 3000,
  },
  {
    name: "Strength training",
    value: 1500,
  },
  {
    name: "Cycling",
    value: 500,
  },
];
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const COLORS = ["#FF4D4D", "#FF9800", "#4C9AFF", "#4CAF50"];
// const COLORS = ["#E63946", "#F4A261", "#2A9D8F", "#457B9D"];
// const COLORS = ["#FF6B6B", "#4ECDC4", "#FF9F1C", "#2EC4B6"];
// const COLORS = ["#A3E4DB", "#FFC6A4", "#FFDD94", "#A7C5EB"];
// const COLORS = ["#4A90E2", "#6A5ACD", "#7289DA", "#8A2BE2"];




const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const PieChartCompoenent = ({data}) => {
  return (
    <ResponsiveContainer width={"100%"} height={220}>
      <PieChart >
        <Pie
          data={ data}
          cx={"50%"}
          cy={"50%"}
          labelLine={false}
          label={renderCustomizedLabel}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey={"value"}
          nameKey="workout"
          isAnimationActive={true}
          animationDuration={1500}
        >
          { data &&data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartCompoenent;
