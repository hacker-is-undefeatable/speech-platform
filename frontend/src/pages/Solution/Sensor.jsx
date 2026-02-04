import React from 'react';

export default function SensorIdeaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full">
        <h2 className="text-4xl font-bold text-purple-600 mb-6 flex items-center gap-4">
          <span className="text-5xl">🔍</span> Ambient Sensor Concept
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Always-on, privacy-first Cantonese audio + motion sensors to detect distress or anomalies — processed on-device.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
            <h3 className="text-2xl font-semibold text-purple-700 mb-4">Key Features</h3>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li>Real-time Cantonese ASR on edge device</li>
              <li>Motion + voice anomaly detection</li>
              <li>No cloud upload unless critical alert</li>
              <li>Low-power mode for long battery life</li>
            </ul>
          </div>
          <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
            <h3 className="text-2xl font-semibold text-purple-700 mb-4">Current Prototype</h3>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li>Raspberry Pi + microphone + motion sensor</li>
              <li>Testing in real Cantonese households</li>
              <li>Emergency contact integration planned</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}