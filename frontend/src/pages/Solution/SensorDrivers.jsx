import React from "react";
import "./Sensor.css";

export default function SensorDrivers() {
  return (
    <div className="sensor-page">
      <div className="content-wrapper">
        <section className="section-card">
          <h2 className="section-title">Key Drivers</h2>
          <ul className="list">
            <li><strong>Aging Population</strong></li>
            <p>
              The global elderly population is growing rapidly, increasing the demand for reliable, in-home safety and monitoring solutions.
            </p>
            <li><strong>AI & Edge Computing</strong></li>
            <p>
              Advances in AI, machine learning, and edge computing enable accurate, real-time analysis directly on devices improving privacy and responsiveness.
            </p>
            <li><strong>Shift to Home-Based Healthcare</strong></li>
            <p>
              Healthcare is moving from hospitals to homes, with remote monitoring and telemedicine becoming standard care models.
            </p>
            <li><strong>Smart Device Adoption</strong></li>
            <p>
              Widespread adoption of smartwatches and smart home systems has normalized fall detection and automated safety features.
            </p>
            <li><strong>Regulatory & Policy Support</strong></li>
            <p>
              Hong Kong’s Smart City initiatives and government subsidies encourage the adoption of elderly care and safety technologies.
            </p>
            <li><strong>Cost & Reimbursement Opportunities</strong></li>
            <p>
              Insurance reimbursements and public healthcare schemes create sustainable pathways for large-scale deployment.
            </p>
          </ul>
        </section>
      </div>
    </div>
  );
}
