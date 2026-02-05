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

export default function SensorIdeaPage() {
  return (
    <div className="sensor-page">
      <div className="content-wrapper">

        {/* Header */}
        <div className="header-card">
          <h1 className="main-title">
            Safety for aging loved ones — without wearables, buttons or effort
          </h1>
          <p className="main-subtitle">
            An always-on, non-invasive safety device designed for Hong Kong homes, detecting falls, distress calls, and abnormal inactivity automatically — even in noisy environments.
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
              <p>
                Personal Emergency Response Systems (PERS, 平安鐘) are widely adopted among elderly users in Hong Kong, yet satisfaction remains low.
              </p>

              <p>
                Most systems rely on pendants or wristbands that must be worn at all times. In reality, these devices are often forgotten, uncomfortable, or intentionally removed, especially at home, leading to delayed or missed emergency responses during falls or sudden health incidents.
                When emergencies happen, the people who need help the most are often unable to press a button or call for assistance.
              </p>
            </p>
          </section>

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

          {/* <section className="section-card">
            <h2 className="section-title">Problem–Solution Matrix</h2>
            <ul className="list">
              <li><strong>Forgetful Wearables</strong></li>
              <p>
                Solved by an always-on ambient device that requires no wearing or activation.
              </p>
              <li><strong>Privacy Concerns</strong></li>
              <p>
                Addressed with fully on-device ASR — no cloud processing for core safety features.
              </p>
              <li><strong>Noisy Urban Homes</strong></li>
              <p>
                Mitigated using beamforming microphone arrays to isolate weak distress calls.
              </p>
            </ul>
          </section> */}
        </div>

        {/* Market & Drivers */}
        <div className="grid-2">
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

        {/* Challenges & Competitors */}
        <div className="grid-2">
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
