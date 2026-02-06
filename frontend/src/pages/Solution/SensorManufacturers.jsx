import React from "react";
import "./Sensor.css";

export default function SensorManufacturers() {
  return (
    <div className="sensor-page">
      <div className="content-wrapper">
        <section className="section-card">
          <h2 className="section-title">
            Leading Sensor Manufacturers
          </h2>
          <ul className="list">
            <li>Bosch — MEMS sensors</li>
            <li>STMicroelectronics, Analog Devices</li>
            <li>Infineon — AI-enhanced edge sensing</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
