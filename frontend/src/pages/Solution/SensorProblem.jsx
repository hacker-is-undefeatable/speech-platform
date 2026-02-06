import React from "react";
import "./Sensor.css";

export default function SensorProblem() {
  return (
    <div className="sensor-page">
      <div className="content-wrapper">
        <section className="section-card">
          <h2 className="section-title">Problem Statement</h2>
          <div className="text-content">
            <p>
              Personal Emergency Response Systems (PERS, 平安鐘) are widely adopted among elderly users in Hong Kong, yet satisfaction remains low.
            </p>
            <p>
              Most systems rely on pendants or wristbands that must be worn at all times. In reality, these devices are often forgotten, uncomfortable, or intentionally removed, especially at home, leading to delayed or missed emergency responses during falls or sudden health incidents.
              When emergencies happen, the people who need help the most are often unable to press a button or call for assistance.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
