import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { jsPDF } from 'jspdf';
import * as docx from 'docx';
import WaveSurfer from 'https://cdn.jsdelivr.net/npm/wavesurfer.js@7/dist/wavesurfer.esm.js';
import './Transcribe.css';

function Transcribe({ isAuthenticated, setIsAuthenticated, language, setLanguage, credit, setCredit }) {
  const [transcript, setTranscript] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [numSpeakers, setNumSpeakers] = useState(2);
  const [hasTranscribed, setHasTranscribed] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);
  const navigate = useNavigate();
  const waveformRefs = useRef([]);
  const wavesurferRefs = useRef([]);

  const parseTranscript = (text) => {
    if (!text) return [];
    const lines = text.split('\n');
    const parsed = lines.map((line, index) => {
      const match = line.match(/\[([\d.]+)s - ([\d.]+)s\]\s*Speaker\s*(\w+):\s*(.*)/);
      if (match) {
        return {
          chunk_index: index,
          timestamp: `${parseFloat(match[1]).toFixed(2)}s - ${parseFloat(match[2]).toFixed(2)}s`,
          start_time: parseFloat(match[1]).toFixed(2),
          end_time: parseFloat(match[2]).toFixed(2),
          speaker: `Speaker ${match[3].replace('SPEAKER_', '')}`,
          speakerId: match[3],
          text: match[4],
        };
      }
      return null;
    }).filter(Boolean);
    return parsed;
  };

  const getUniqueSpeakers = () => {
    const speakers = [...new Set(transcript.map((entry) => entry.speaker))];
    return speakers.length > 0 ? speakers : ['Speaker 1', 'Speaker 2'];
  };

  useEffect(() => {
    const loadTranscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: sessions, error: sessionError } = await supabase
          .from('transcription_sessions')
          .select('session_id')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (sessionError && sessionError.code !== 'PGRST116') {
          console.error('Error loading session:', sessionError);
          setError('Failed to load transcription session. Please try again.');
          return;
        }

        const sessionId = sessions?.session_id;
        if (sessionId) {
          const { data: chunks, error: chunkError } = await supabase
            .from('transcription_chunks')
            .select('*')
            .eq('session_id', sessionId)
            .order('chunk_index', { ascending: true });

          if (chunkError) {
            console.error('Error loading chunks:', chunkError);
            setError('Failed to load transcription data. Please try again.');
          } else if (chunks) {
            setTranscript(
              chunks.map((chunk) => ({
                chunk_index: chunk.chunk_index,
                timestamp: `${parseFloat(chunk.start_time).toFixed(2)}s - ${parseFloat(chunk.end_time).toFixed(2)}s`,
                start_time: parseFloat(chunk.start_time).toFixed(2),
                end_time: parseFloat(chunk.end_time).toFixed(2),
                speaker: `Speaker ${chunk.speaker.replace('SPEAKER_', '')}`,
                speakerId: chunk.speaker,
                text: chunk.transcription_text || '',
                audio_chunk_url: chunk.audio_chunk_url,
              }))
            );
            setHasTranscribed(chunks.length > 0);
          }
        }
      }
    };
    loadTranscription();
  }, []);

  useEffect(() => {
    // Initialize WaveSurfer for each transcript entry
    waveformRefs.current = Array(transcript.length).fill().map((_, i) => waveformRefs.current[i] || React.createRef());
    wavesurferRefs.current = Array(transcript.length).fill(null);

    transcript.forEach((entry, index) => {
      if (entry.audio_chunk_url && waveformRefs.current[index]?.current) {
        if (wavesurferRefs.current[index]) {
          wavesurferRefs.current[index].destroy();
        }

        wavesurferRefs.current[index] = WaveSurfer.create({
          container: waveformRefs.current[index].current,
          waveColor: '#7d7d7dff',
          progressColor: '#9500ffff',
          barWidth: 4,
          height: 50,
          responsive: true,
          barRadius: 3,
        });

        wavesurferRefs.current[index].on('play', () => {
          setPlayingIndex(index);
        });
        wavesurferRefs.current[index].on('pause', () => {
          if (playingIndex === index) setPlayingIndex(null);
        });
        wavesurferRefs.current[index].on('finish', () => {
          if (playingIndex === index) setPlayingIndex(null);
        });
        wavesurferRefs.current[index].on('error', (error) => {
          console.error(`WaveSurfer error at index ${index}:`, error);
          setError('Failed to load audio for one or more chunks.');
        });

        wavesurferRefs.current[index].load(entry.audio_chunk_url);
      }
    });

    return () => {
      // Cleanup WaveSurfer instances
      wavesurferRefs.current.forEach((ws) => {
        if (ws) {
          ws.destroy();
        }
      });
      wavesurferRefs.current = [];
    };
  }, [transcript]);

  useEffect(() => {
    // Pause other WaveSurfer instances when one starts playing
    wavesurferRefs.current.forEach((ws, i) => {
      if (ws && i !== playingIndex && playingIndex !== null) {
        ws.pause();
      }
    });
  }, [playingIndex]);

  const handleFileChange = (event) => {
    const file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
    if (file && file.type === 'audio/wav') {
      setSelectedFile(file);
      setTranscript([]);
      setError('');
      setHasTranscribed(false);
      setPlayingIndex(null);
    } else {
      alert('Please upload a WAV file.');
      setSelectedFile(null);
      setError('Invalid file format. Only WAV files are supported.');
      setHasTranscribed(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFileChange(event);
  };

  const sendAudioToBackend = async (audioBlob) => {
    setIsLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('audio', audioBlob, audioBlob.name);
    formData.append('num_speakers', numSpeakers);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await new Promise((resolve) => {
        audio.onloadedmetadata = () => {
          resolve();
        };
      });
      const durationSec = audio.duration;
      const minutes = Math.ceil(durationSec / 60);

      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('credits')
        .eq('id', session.user.id)
        .single();

      if (userError) throw new Error('Failed to fetch user credits');

      const currentCredits = userData.credits || 0;

      if (currentCredits < minutes) {
        setShowInsufficientCredits(true);
        setIsLoading(false);
        return;
      }

      const newCredits = currentCredits - minutes;
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ credits: newCredits })
        .eq('id', session.user.id);

      if (updateError) throw new Error('Failed to update user credits');
      if (typeof setCredit === 'function') setCredit(newCredits);

      const response = await fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${data.error || 'Unknown error'}`);
      }

      if (data.error) {
        setError(data.error || 'Transcription failed. Please try again.');
        setHasTranscribed(false);
        if (data.error.includes('token')) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          navigate('/login');
        }
        setTranscript([]);
      } else {
        const parsedTranscript = parseTranscript(data.transcript);
        setTranscript(parsedTranscript.filter(entry => entry.text && entry.text.trim()));
        setHasTranscribed(parsedTranscript.filter(entry => entry.text && entry.text.trim()).length > 0);

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: sessions } = await supabase
            .from('transcription_sessions')
            .select('session_id')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const sessionId = sessions?.session_id;
          if (sessionId) {
            const { data: chunks } = await supabase
              .from('transcription_chunks')
              .select('*')
              .eq('session_id', sessionId)
              .order('chunk_index', { ascending: true });

            if (chunks) {
              const updatedTranscript = chunks
                .map((chunk) => ({
                  chunk_index: chunk.chunk_index,
                  timestamp: `${parseFloat(chunk.start_time).toFixed(2)}s - ${parseFloat(chunk.end_time).toFixed(2)}s`,
                  start_time: parseFloat(chunk.start_time).toFixed(2),
                  end_time: parseFloat(chunk.end_time).toFixed(2),
                  speaker: `Speaker ${chunk.speaker.replace('SPEAKER_', '')}`,
                  speakerId: chunk.speaker,
                  text: chunk.transcription_text || '',
                  audio_chunk_url: chunk.audio_chunk_url,
                }))
                .filter(entry => entry.text && entry.text.trim());
              setTranscript(updatedTranscript);
              setHasTranscribed(updatedTranscript.length > 0);
              if (typeof setCredit === 'function') setCredit(newCredits);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending audio:', error);
      setError('Failed to process audio. Please check your file and try again.');
      setTranscript([]);
      setHasTranscribed(false);
      if (error.message.includes('authenticated')) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscribe = () => {
    if (!selectedFile) {
      alert('Please upload a WAV file first.');
      setError('No file selected. Please upload a WAV file.');
      return;
    }
    sendAudioToBackend(selectedFile);
  };

  const handleSpeakerChange = (index, newSpeaker) => {
    const updatedTranscript = [...transcript];
    updatedTranscript[index].speaker = newSpeaker;
    updatedTranscript[index].speakerId = `SPEAKER_${parseInt(newSpeaker.split(' ')[1]) - 1}`.padStart(2, '0');
    setTranscript(updatedTranscript);
  };

  const handleTextChange = (index, newText) => {
    const updatedTranscript = [...transcript];
    updatedTranscript[index].text = newText;
    setTranscript(updatedTranscript);
  };

  const handleSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      const { data: sessionData } = await supabase
        .from('transcription_sessions')
        .select('session_id')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!sessionData) {
        throw new Error('No session found');
      }

      const sessionId = sessionData.session_id;

      for (const entry of transcript) {
        const { error } = await supabase
          .from('transcription_chunks')
          .update({
            transcription_text: entry.text,
            speaker: entry.speakerId,
          })
          .eq('session_id', sessionId)
          .eq('chunk_index', entry.chunk_index);

        if (error) {
          throw new Error(`Error updating chunk ${entry.chunk_index}: ${error.message}`);
        }
      }

      alert('Transcript saved successfully!');
    } catch (error) {
      console.error('Error saving transcript:', error);
      setError('Failed to save transcript. Please try again.');
    }
  };

  const handleTogglePlay = (index) => {
    if (wavesurferRefs.current[index]) {
      if (playingIndex === index) {
        wavesurferRefs.current[index].pause();
      } else {
        wavesurferRefs.current.forEach((ws, i) => {
          if (ws && i !== index) {
            ws.pause();
          }
        });
        wavesurferRefs.current[index].play();
      }
    }
  };

  // Export functions
  const exportToTxt = () => {
    const content = transcript
      .map((entry) => `[${entry.timestamp}] ${entry.speaker}: ${entry.text}`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToSrt = () => {
    const content = transcript
      .map((entry, index) => {
        const start = new Date(entry.start_time * 1000).toISOString().substr(11, 12).replace('.', ',');
        const end = new Date(entry.end_time * 1000).toISOString().substr(11, 12).replace('.', ',');
        return `${index + 1}\n${start} --> ${end}\n${entry.speaker}: ${entry.text}\n`;
      })
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.srt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToHtml = () => {
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Transcript</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .entry { margin-bottom: 10px; }
          .timestamp { font-weight: bold; }
          .speaker { color: #2c3e50; }
          .text { margin-left: 20px; }
        </style>
      </head>
      <body>
        <h1>Transcript</h1>
        ${transcript
          .map(
            (entry) => `
              <div class="entry">
                <span class="timestamp">[${entry.timestamp}]</span>
                <span class="speaker">${entry.speaker}:</span>
                <span class="text">${entry.text}</span>
              </div>
            `
          )
          .join('')}
      </body>
      </html>
    `;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToWord = () => {
    const { Document, Packer, Paragraph, TextRun } = docx;
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Transcript', size: 24, bold: true })],
            }),
            ...transcript.flatMap((entry) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `[${entry.timestamp}] ${entry.speaker}: `,
                    bold: true,
                  }),
                  new TextRun({ text: entry.text }),
                ],
              }),
              new Paragraph({}),
            ]),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transcript.docx';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Transcript', 20, 20);
    let y = 30;
    transcript.forEach((entry) => {
      const text = `[${entry.timestamp}] ${entry.speaker}: ${entry.text}`;
      const splitText = doc.splitTextToSize(text, 170);
      doc.text(splitText, 20, y);
      y += splitText.length * 7 + 5;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save('transcript.pdf');
  };

  return (
    <div className="transcribe-container">
      <p className="upload-instructions">Upload or drag a WAV file to start transcription.</p>
      <div>
        <div
          className="drop-zone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <p>Drag and drop a WAV file here, or click to select.</p>
          <input
            type="file"
            accept="audio/wav"
            onChange={handleFileChange}
            aria-label="Upload WAV file"
          />
        </div>
        {selectedFile && (
          <div>
            <p>Selected file: {selectedFile.name}</p>
            <button
              className="transcribe-btn"
              onClick={handleTranscribe}
              disabled={isLoading}
              aria-label={isLoading ? 'Transcribing in progress' : 'Start transcription'}
            >
              {isLoading ? 'Transcribing...' : 'Transcribe'}
            </button>
          </div>
        )}
        {error && <p className="error-message" role="alert">Error: {error}</p>}
        <label htmlFor="num-speakers" className="num-speakers-label">
          Number of speakers:&nbsp;
        </label>
        <select
          id="num-speakers"
          className="num-speakers-select"
          value={numSpeakers}
          onChange={(e) => setNumSpeakers(Number(e.target.value))}
          aria-label="Select number of speakers"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        {hasTranscribed && (
          <div>
            <h3>Latest Transcript Result:</h3>
            <div className="members">
              <table role="grid" className="transcript-table" aria-label="Transcription results">
                <thead>
                  <tr>
                    <th className="col-timestamp" scope="col">Timestamp</th>
                    <th className="col-speaker" scope="col">Speaker</th>
                    <th className="col-transcription" scope="col">Transcription</th>
                    <th className="col-audio" scope="col">Audio</th>
                  </tr>
                </thead>
                <tbody>
                  {transcript.map((entry, index) => (
                    <tr key={index} tabIndex={0}>
                      <td className="col-timestamp">{entry.timestamp}</td>
                      <td className="col-speaker">
                        <select
                          tabIndex={0}
                          value={entry.speaker}
                          onChange={(e) => handleSpeakerChange(index, e.target.value)}
                          aria-label={`Select speaker for chunk ${index + 1}`}
                        >
                          {getUniqueSpeakers().map((speaker) => (
                            <option key={speaker} value={speaker}>
                              {speaker}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="col-transcription">
                        <textarea
                          tabIndex={0}
                          value={entry.text}
                          onChange={(e) => handleTextChange(index, e.target.value)}
                          aria-label={`Edit transcription for chunk ${index + 1}`}
                        />
                      </td>
                      <td className="col-audio">
                        {entry.audio_chunk_url ? (
                          <div className="audio-content">
                            <div
                              className="waveform"
                              ref={waveformRefs.current[index]}
                              style={{ width: '100%', height: '50px' }}
                            ></div>
                            <div className="audio-controls">
                              <button
                                className="play-button"
                                onClick={() => handleTogglePlay(index)}
                                aria-label={playingIndex === index ? 'Pause audio' : 'Play audio'}
                              >
                                <img
                                  src={playingIndex === index ? '/images/pause.png' : '/images/play.png'}
                                  alt={playingIndex === index ? 'Pause' : 'Play'}
                                  className="play-pause-icon"
                                  style={{ width: '24px', height: '24px' }}
                                />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p>No audio available</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                className="save-btn bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleSave}
                aria-label="Save transcription"
              >
                Save
              </button>
              <select
                className="export-select bg-gray-200 text-black px-4 py-2 rounded"
                onChange={(e) => {
                  const format = e.target.value;
                  if (format === 'txt') exportToTxt();
                  if (format === 'srt') exportToSrt();
                  if (format === 'html') exportToHtml();
                  if (format === 'docx') exportToWord();
                  if (format === 'pdf') exportToPdf();
                }}
                aria-label="Select export format"
              >
                <option value="">Export As...</option>
                <option value="txt">TXT</option>
                <option value="srt">SRT</option>
                <option value="html">HTML</option>
                <option value="docx">Word (DOCX)</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          </div>
        )}
        {showInsufficientCredits && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4">Insufficient Credits</h2>
              <p className="mb-4">You don't have enough credits to transcribe this audio. Please top up your account.</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => navigate('/subscription')}
                aria-label="Go to subscription page"
              >
                Top Up Account
              </button>
              <button
                className="ml-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowInsufficientCredits(false)}
                aria-label="Close popup"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transcribe;