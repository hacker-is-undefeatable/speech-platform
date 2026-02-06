import React from "react";
import "./Sensor.css";

export default function SensorFeatures() {
  return (
    <div className="sensor-page">
      <div className="content-wrapper">
        <section className="section-card">
          <h2 className="section-title">Key Features</h2>
          <ul className="list">
            <li>
              <strong>On-device Cantonese ASR</strong>
              <p>
                Low-latency, on-device speech recognition using SonoCanto technology,
                designed for privacy-conscious environments, with optional cloud fallback
                for heavy processing tasks.
              </p>
            </li>
            <li>
              <strong>Privacy by Design</strong>
              <p>
                Voice content and distress calls are never stored on the device, reducing
                privacy and data security risks.
              </p>
            </li>
            <li>
              <strong>Instant Offline Emergency Response</strong>
              <p>
                Recognizes urgent commands such as「救命」or「打電話俾我個仔」and triggers
                alerts even when internet connectivity is unavailable.
              </p>
            </li>
            <li>
              <strong>Multi-Microphone Noise Reduction</strong>
              <p>
                Multi-mic signal de-noising and beamforming technology designed for noisy
                Hong Kong homes.
              </p>
            </li>
            <li>
              <strong>Digital Hearing Focus</strong>
              <p>
                Uses microphone arrays and adaptive filters to suppress background noise
                such as TVs, traffic, fans, and neighboring apartments.
              </p>
            </li>
            <li>
              <strong>High Sensitivity to Weak Distress Calls</strong>
              <p>
                Minimizes false negatives by detecting weak or unclear help calls in
                typical Hong Kong apartment environments.
              </p>
            </li>
            <li>
              <strong>Contextual Audio Intelligence</strong>
              <p>
                Intelligent audio analysis enables name recognition, emergency keyword
                detection, and short contextual summaries.
              </p>
            </li>
            <li>
              <strong>Automatic Caregiver Notifications</strong>
              <p>
                Detects distress keywords, phrases, and sounds such as groans, screams,
                or severe impact noises and notifies designated caregivers immediately.
              </p>
            </li>
            <li>
              <strong>Event Summaries for Caregivers</strong>
              <p>
                Generates brief event summaries (e.g. “21:47: detected keyword ‘pain’;
                22:15: possible fall sound detected”) to provide situational context.
              </p>
            </li>
            <li>
              <strong>Enhanced Recognition Capabilities</strong>
              <p>
                Cantonese ASR optimized for colloquial speech (口語) in noisy environments,
                with future expansion to fall sound detection combining impact and vocal cues.
              </p>
            </li>
            <li>
              <strong>Companion App Support</strong>
              <p>
                Companion applications provide transcript history, caregiver sharing,
                battery monitoring, and firmware management.
              </p>
            </li>
            <li>
              <strong>Multi-Caregiver Access</strong>
              <p>
                Allows multiple family members or professional caregivers to receive alerts
                and system updates.
              </p>
            </li>
            <li>
              <strong>Simple Voice Setup & Local Integrations</strong>
              <p>
                Voice-based setup designed for non-technical users, with WeChat and LINE
                integration for notifications in Hong Kong.
              </p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
