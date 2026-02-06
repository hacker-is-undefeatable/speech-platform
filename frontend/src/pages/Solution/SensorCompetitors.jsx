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
            </div>
        </div>
    );
}
