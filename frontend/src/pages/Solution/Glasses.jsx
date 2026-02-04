import React, { useState } from 'react';

export default function GlassesPlanPage() {
  const [idea, setIdea] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (idea.trim()) {
      setSubmitted(true);
      setIdea('');
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 to-teal-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full">
        <h2 className="text-4xl font-bold text-green-600 mb-6 flex items-center gap-4">
          <span className="text-5xl">🕶️</span> AR Glasses Roadmap
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          Help shape the future: Cantonese subtitles on lens, real-time translation, voice commands, navigation overlays.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Your idea: e.g., 'Live Cantonese → English subtitles', 'Voice-activated controls', 'Emergency translation mode'..."
            rows={7}
            className="w-full p-4 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none resize-none shadow-sm"
          />
          <button type="submit" className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium py-4 px-10 rounded-xl shadow-lg hover:from-green-600 hover:to-teal-700 hover:shadow-xl transition-all duration-300 text-lg w-full">
            Submit Your Idea
          </button>
        </form>

        {submitted && (
          <div className="mt-8 p-6 bg-green-100 border border-green-300 rounded-xl text-center text-green-800 font-medium">
            Thank you! Your idea has been recorded 🌟 We'll review it soon.
          </div>
        )}
      </div>
    </div>
  );
}