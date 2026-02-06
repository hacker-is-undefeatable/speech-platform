import React from "react";
import "./Sensor.css";

export default function SensorCore() {
  return (
    <div className="sensor-page">
      <div className="content-wrapper">
        <section className="section-card">
          <h2 className="section-title">Core Promise</h2>
          <p className="text-content">
            SonoCanto enables safe, independent living by continuously monitoring ambient Cantonese speech.
            The system delivers real-time spoken Cantonese captions, speaker feedback, and instant alerts for distress,
            all without requiring wearables (e.g., help, fall, patient name).
          </p>
          <ul className="list">
            <li>Dialect-specific ASR (HK / Guangdong Cantonese)</li>
            <li>Detects urgency phrases like「救命」and personal names</li>
            <li>Designed for noisy urban apartments</li>
          </ul>
          <p className="text-content text-italic">
            Example: When Mrs. Lee (75) cries weakly in her Tsim Sha Tsui kitchen,
            the device cuts through traffic noise and alerts her daughter immediately.
          </p>
        </section>
      </div>
    </div>
  );
}
