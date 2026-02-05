import React from "react";
import "./Sensor.css";

export default function SensorIdeaPage() {
  return (
    <div className="sensor-page">
      <div className="content-wrapper">

        {/* Header */}
        <div className="header-card">
          <h1 className="main-title">
            SonoCanto Ambient Sensor
          </h1>
          <p className="main-subtitle">
            Passive, privacy-first Cantonese voice and motion sensing for safe, independent living — without wearables.
          </p>
        </div>

        {/* Core Promise */}
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

        {/* Problem & Solution */}
        <div className="grid-2">
          <section className="section-card">
            <h2 className="section-title">Problem Statement</h2>
            <p className="text-content">
              Traditional personal emergency response systems (平安鐘) have high adoption
              but low satisfaction due to discomfort, stigma, and users forgetting to wear them.
            </p>
            <ul className="list">
              <li>High compliance burden on elderly users</li>
              <li>Small HK apartments + heavy noise pollution</li>
              <li>Over 20% of HK residents will be 65+ by 2026</li>
            </ul>
          </section>

          <section className="section-card">
            <h2 className="section-title">Problem–Solution Matrix</h2>
            <ul className="list">
              <li>Forgetful wearables → Always-on ambient device</li>
              <li>Privacy concerns → Fully on-device ASR</li>
              <li>Noisy homes → Beamforming microphone array</li>
            </ul>
          </section>
        </div>

        {/* Market & Drivers */}
        <div className="grid-2">
          <section className="section-card">
            <h2 className="section-title">Market Data</h2>
            <ul className="list">
              <li>2021 market size: $381.6M</li>
              <li>2024 market size: $741.0M</li>
              <li>2032 projection: $1.38B</li>
              <li>CAGR (2022–2029): 15.53%</li>
              <li>APAC growth ~18% (faster than global)</li>
            </ul>
          </section>

          <section className="section-card">
            <h2 className="section-title">Key Drivers</h2>
            <ul className="list">
              <li>Rapidly aging global population</li>
              <li>Edge AI + on-device ML maturity</li>
              <li>Shift to remote and home-based healthcare</li>
              <li>Smart home and wearable adoption</li>
              <li>HK smart city subsidies and insurer reimbursement potential</li>
            </ul>
          </section>
        </div>

        {/* Challenges & Competitors */}
        <div className="grid-2">
          <section className="section-card">
            <h2 className="section-title">Challenges</h2>
            <ul className="list">
              <li>False alarms → mitigated via HK elder datasets</li>
              <li>Privacy → PDPO / GDPR compliant, no cloud by default</li>
              <li>User acceptance → discreet smart-speaker-like design</li>
              <li>Cost & reimbursement uncertainty</li>
              <li>Supply-chain risks → multi-supplier strategy</li>
            </ul>
          </section>

          <section className="section-card">
            <h2 className="section-title">Competitor Analysis</h2>
            <p className="text-content">
              SonoCanto ranks highest due to native Cantonese support and privacy-by-design,
              outperforming Apple Watch, Philips Lifeline, Amazon Echo, and Tunstall systems.
            </p>
          </section>
        </div>

        {/* Differentiators & Manufacturers */}
        <div className="grid-2">
          <section className="section-card">
            <h2 className="section-title">Key Differentiators</h2>
            <ul className="list">
              <li>Passive, wearable-free safety</li>
              <li>Native Cantonese 口語 ASR</li>
              <li>NLP summaries, not just alerts</li>
              <li>Emergency-focused vs general captioning tools</li>
            </ul>
          </section>

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

        {/* Partnerships & Features */}
        <div className="grid-2">
          <section className="section-card">
            <h2 className="section-title">Partnership Opportunities</h2>
            <ul className="list">
              <li>Samsung SmartThings integration</li>
              <li>NGOs (HKCSS, elderly pilots)</li>
              <li>Hospitals & telemedicine (HA)</li>
              <li>Telecom bundling (PCCW)</li>
            </ul>
          </section>

          <section className="section-card">
            <h2 className="section-title">Key Features</h2>
            <ul className="list">
              <li>On-device Cantonese ASR (95% accuracy)</li>
              <li>Emergency keyword & name detection</li>
              <li>Multi-mic beamforming & noise suppression</li>
              <li>Instant alerts even without internet</li>
              <li>Caregiver summaries & companion app</li>
            </ul>
          </section>
        </div>

        {/* Roadmap & Monetisation */}
        <div className="grid-3">
          <section className="section-card">
            <h2 className="section-title">Product Roadmap</h2>
            <ul className="list">
              <li>v1: Basic alerts</li>
              <li>v2: Health signals (breathing patterns)</li>
              <li>v3: Multi-device mesh homes</li>
            </ul>
          </section>

          <section className="section-card">
            <h2 className="section-title">Monetisation</h2>
            <ul className="list">
              <li>$100 one-time hardware</li>
              <li>Basic: $5/month</li>
              <li>Premium: analytics + telehealth</li>
              <li>B2B & white-label telecom deals</li>
            </ul>
          </section>

          <section className="section-card">
            <h2 className="section-title">Next Steps</h2>
            <ul className="list">
              <li>$500K seed funding</li>
              <li>HK beta with NGOs</li>
              <li>Target launch: Q4 2026</li>
            </ul>
          </section>
        </div>

      </div>
    </div>
  );
}
