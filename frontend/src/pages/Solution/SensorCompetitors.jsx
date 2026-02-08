import React from "react";
import "./Sensor.css";

export default function SensorCompetitors() {
    return (
        <div className="sensor-page">
            <div className="content-wrapper">
                <section className="section-card">
                    <h2 className="section-title">Competitor Analysis</h2>
                    <p className="text-content">
                        SonoCanto ranks highest due to native Cantonese support and privacy-by-design,
                        outperforming Apple Watch, Philips Lifeline, Amazon Echo, and Tunstall systems.
                    </p>
                    <div className="table-container">
                        <table className="challenges-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '16%' }}>Product/ Company</th>
                                    <th style={{ width: '16%' }}>Features (1-5)</th>
                                    <th style={{ width: '17%' }}>Price</th>
                                    <th style={{ width: '17%' }}>Language Support (1-5)</th>
                                    <th style={{ width: '17%' }}>Privacy (1-5)</th>
                                    <th style={{ width: '17%' }}>Total Score </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>SonoCanto
                                        Safety Device
                                    </strong></td>
                                    <td>5 (Ambient audio with NLP summaries, keyword alerts, beamforming for noise)
                                    </td>
                                    <td>$100 hardware + $5-10/month sub</td>
                                    <td>5 (Native spoken cantonese dialects)
                                    </td>
                                    <td>5 (On-device ASR, no cloud for core functions)</td>
                                    <td>20/20</td>
                                </tr>
                                <tr>
                                    <td><strong>Apple Watch (Fall Detection)</strong></td>
                                    <td>4 (Wearable sensors, integration with health apps)</td>
                                    <td>$400 + hardware + optional sub</td>
                                    <td>3 (English/Mandarin primary; limited Cantonese)
                                    </td>
                                    <td>3 (Cloud syncing required for full features)</td>
                                    <td>13/20</td>
                                </tr>
                                <tr>
                                    <td><strong>Philips Lifeline</strong></td>
                                    <td>3 (Basic alerts, wearable/ ambient options)</td>
                                    <td>$50-100 hardware + $30/ month sub</td>
                                    <td>2 (Mostly English; no native Cantonese)</td>
                                    <td>4 (Some on-device, but data shared with services)</td>
                                    <td>12/20</td>
                                </tr>
                                <tr>
                                    <td><strong>Amazon Echo (Emergency Features)</strong></td>
                                    <td>3 (Voice commands, basic detection)</td>
                                    <td>$50 hardware + free/basic sub</td>
                                    <td>3 (English focus; improving Asian languages)
                                    </td>
                                    <td>2 (Heavy cloud reliance, privacy concerns)</td>
                                    <td>13/20</td>
                                </tr>
                                <tr>
                                    <td><strong>Tunstall Group (PERS Systems) </strong></td>
                                    <td>4 (Multi-sensor, professional monitoring)</td>
                                    <td>$200 + hardware + $40/month sub</td>
                                    <td>2 (Customizable but not Cantonese-specific)</td>
                                    <td>4 (Secure but often cloud-based)</td>
                                    <td>14/20</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="section-card">
                    <h2 className="section-title">Key Differentiators</h2>
                    <ul className="differentiators-list" style={{ listStyleType: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '25px' }}>
                            <h3 style={{ color: '#8000ff', fontSize: '1.2rem', marginBottom: '8px' }}>Passive & Native Design</h3>
                            <p className="text-content" style={{ margin: 0 }}>
                                Unlike the Apple Watch which relies on active wearing, SonoCanto is a passive, ambient system. It provides continuous protection native to Cantonese speakers without requiring the elderly to manage a wearable device.
                            </p>
                        </li>
                        <li style={{ marginBottom: '25px' }}>
                            <h3 style={{ color: '#8000ff', fontSize: '1.2rem', marginBottom: '8px' }}>Actionable Insights vs. Alerts</h3>
                            <p className="text-content" style={{ margin: 0 }}>
                                While systems like Philips Lifeline focus on simple alerts, SonoCanto leverages NLP to generate context-aware summaries. This ensures caregivers understand the situation's nuance rather than just receiving a binary alarm.
                            </p>
                        </li>
                        <li>
                            <h3 style={{ color: '#8000ff', fontSize: '1.2rem', marginBottom: '8px' }}>Specialized Emergency Recognition</h3>
                            <p className="text-content" style={{ margin: 0 }}>
                                General captioning tools (e.g., Ava/Transcense) often struggle with Asian dialects in high-stress environments. SonoCanto is engineered specifically for emergency scenarios, prioritizing accuracy for Cantonese speakers where generalist tools fall short.
                            </p>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
