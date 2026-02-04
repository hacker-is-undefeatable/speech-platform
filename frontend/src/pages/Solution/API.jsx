import React, { useState } from 'react';

export default function CantoneseAPIPage() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  const simulateTranscription = () => {
    setLoading(true);
    setTranscript('Processing audio...');
    setTimeout(() => {
      setTranscript('你好呀！今日天氣真係好好～ 😊');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
        <h2 className="text-4xl font-bold text-indigo-600 mb-6 flex justify-center items-center gap-4">
          <span className="text-5xl">🎤</span> Cantonese STT Demo
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          Click to simulate real-time Cantonese speech-to-text.
        </p>
        <button
          onClick={simulateTranscription}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-4 px-10 rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl transition-all duration-300 text-lg"
        >
          {loading ? 'Transcribing...' : 'Start Transcription'}
        </button>
        <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200 min-h-[120px] text-left font-mono text-gray-800">
          {transcript || 'Waiting for audio input...'}
        </div>
      </div>
    </div>
  );
}