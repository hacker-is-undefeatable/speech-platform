import React from "react";
import "./Sensor.css";

export default function SensorChallenges() {
  return (
    <div className="sensor-page">
      <div className="content-wrapper">
        <section className="section-card">
          <h2 className="section-title">Challenges</h2>
          <div className="table-container">
            <table className="challenges-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Challenge</th>
                  <th style={{ width: '40%' }}>Description</th>
                  <th style={{ width: '40%' }}>Mitigation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Precision and False Alarms</strong></td>
                  <td>Minimizing false alarms while maximizing sensitivity for real falls and distress events is technically challenging.</td>
                  <td>Train models using diverse Cantonese datasets and validate performance through pilot testing with 100 Hong Kong elderly users.</td>
                </tr>
                <tr>
                  <td><strong>Privacy</strong></td>
                  <td>In-home and ambient monitoring systems raise concerns around data security and user consent.</td>
                  <td>Ensure GDPR and HK PDPO compliance with fully on-device processing; optional cloud opt-in limited to non-urgent features.</td>
                </tr>
                <tr>
                  <td><strong>Acceptance and Usability</strong></td>
                  <td>Elderly users may resist technology that feels intrusive, complex, or stigmatizing.</td>
                  <td>Minimalistic, domestic design resembling a smart speaker to blend naturally into home environments.</td>
                </tr>
                <tr>
                  <td><strong>Cost and Reimbursement</strong></td>
                  <td>High-quality sensing hardware can be expensive, while insurance reimbursement frameworks are still developing.</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td><strong>Supply Chain Risk</strong></td>
                  <td>Microphone and sensor component availability may be affected by global supply chain disruptions.</td>
                  <td>Work with multiple suppliers to reduce dependency on any single source.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
