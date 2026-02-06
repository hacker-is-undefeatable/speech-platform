import React from "react";
import "./Sensor.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const marketData = [
  { year: "2021", value: 381 },
  { year: "2024", value: 741 },
  { year: "2032 (Predicted)", value: 1380 },
];

export default function SensorMarket() {
  return (
    <div className="sensor-page">
      <div className="content-wrapper">
        <section className="section-card">
          <h2 className="section-title">Market Opportunity</h2>
          <div className="market-layout">
            <div>
              <p className="text-content mb-6">
                The global fall detection systems market is growing rapidly, driven by
                population aging and home-based care adoption.
              </p>
              <ul className="list">
                <li><strong>CAGR (2022–2029):</strong> 15.5%</li>
                <li><strong>APAC growth:</strong> ~18%, faster than global average</li>
                <li><strong>Current dominant segment:</strong> Wearable systems</li>
                <li><strong>Primary driver:</strong> Rapidly aging population</li>
              </ul>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#ff00cc" stopOpacity={1} />
                      <stop offset="95%" stopColor="#00ddff" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis
                    dataKey="year"
                    stroke="#aaaaaa"
                    tick={{ fill: '#cccccc' }}
                    tickLine={{ stroke: '#555555' }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value}M`}
                    stroke="#aaaaaa"
                    tick={{ fill: '#cccccc' }}
                    tickLine={{ stroke: '#555555' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(20, 20, 20, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                    }}
                    labelStyle={{ color: '#aaaaaa' }}
                    itemStyle={{ color: '#00ddff' }}
                    formatter={(value) => [`$${value}M`, "Market Size"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="url(#colorValue)"
                    strokeWidth={4}
                    dot={{ r: 6, fill: '#1a1a1a', stroke: '#ff00cc', strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: '#00ddff', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
