"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

export default function AnalyticsChart() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  async function fetchAnalytics() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/analytics/7days");
      if (!res.ok) {
        setError("Failed to load analytics");
        setData([]);
        return;
      }

      const json = await res.json();
      setData(json);
    } catch {
      setError("Network error while loading analytics");
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalytics();
  }, []);



  return (
    <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-5 shadow-sm">
      <h2 className="font-semibold text-lg mb- text-gray-800 dark:text-gray-100">
        Analytics
      </h2>

      <ResponsiveContainer width="100%" height={150}>
           <div className="flex items-center justify-between mb-2">
          {/* <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
            Last 7 Days
          </h2> */}

          {error && (
            <button
              onClick={fetchAnalytics}
              className="text-xs px-2 py-1 border rounded text-red-600 hover:bg-red-50 dark:hover:bg-slate-700"
            >
              Retry
            </button>
          )}
        </div>

        {/* {loading && !error && (
          <p className="text-xs text-gray-500 mb-2">Loading analytics…</p>
        )} */}

      
        <LineChart
          data={data}
        >
          <CartesianGrid stroke="#aaa" strokeDasharray="2 2" />
          <Line type="monotone" dataKey="clicks" stroke="purple" strokeWidth={2} name="Clicks in last 7 days" />
          <XAxis dataKey="date" />
          <YAxis width="auto" label={{ value: 'clicks', position: 'insideLeft', angle: -90 }} />
          <Legend align="right" />
          <Tooltip />
        </LineChart>

       {/* {error && (
          <p className="text-xs text-red-500 mb-2">{error}</p>
        )} */}

      </ResponsiveContainer>


    </div>
  );
}
