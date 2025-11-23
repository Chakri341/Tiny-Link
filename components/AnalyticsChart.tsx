"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

export default function AnalyticsChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/analytics/7days")
      .then(res => res.json())
      .then(setData)
      .catch(() => setData([]));


  }, []);


  return (
    <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-5 shadow-sm">
      <h2 className="font-semibold text-lg mb- text-gray-800 dark:text-gray-100">
       Analytics
      </h2>

      <ResponsiveContainer width="100%" height={150}>

        <LineChart
          data={data}

        >
          <CartesianGrid stroke="#aaa" strokeDasharray="2 2" />
          <Line type="monotone" dataKey="clicks" stroke="purple" strokeWidth={2} name="Clicks in last 7 days" />
          <XAxis dataKey="date" />
           <YAxis width="auto" label={{ value: 'clicks', position: 'insideLeft',  angle: -90 }} />
          <Legend align="right" />
          <Tooltip />
        </LineChart>

      </ResponsiveContainer>


    </div>
  );
}
