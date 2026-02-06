import React from "react";
import "./Sensor.css";

export default function SensorHKContext() {
  return (
    <div className="sensor-page">
      <div className="content-wrapper">
        <section className="section-card">
          <h2 className="section-title">Why This Problem Is Worse in Hong Kong?</h2>
          <ul className="list">
            <li><strong>Rapidly aging population</strong></li>
            <p>
              By 2026, over 20% of Hong Kong residents will be aged 65 or above.
            </p>
            <li><strong>Small, high-density apartments</strong></li>
            <p>
              Most elderly live alone in compact flats where falls often happen out of sight.
            </p>
            <li><strong>Severe noise pollution</strong></li>
            <p>
              Traffic, TVs, neighbors, and construction make voice-based or manual alerts unreliable.
            </p>
            <li><strong>Urban isolation</strong></li>
            <p>
              Family members may live far away or work long hours, delaying discovery of emergencies.
            </p>
          </ul>
        </section>
      </div>
    </div>
  );
}
