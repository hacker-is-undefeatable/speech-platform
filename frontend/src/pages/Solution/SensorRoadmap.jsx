import React from "react";
import "./Sensor.css";

export default function SensorRoadmap() {
  return (
    <div className="sensor-page">
      <div className="content-wrapper">
        <section className="section-card">
          <h2 className="section-title">Product Roadmap</h2>
          <ul className="list">
            <li>v1: Basic alerts</li>
            <li>v2: Health signals (breathing patterns)</li>
            <li>v3: Multi-device mesh homes</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
