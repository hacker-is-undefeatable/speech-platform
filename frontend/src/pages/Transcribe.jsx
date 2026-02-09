import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { jsPDF } from 'jspdf';
import * as docx from 'docx';
import { ethers } from 'ethers'; // Requires: npm install ethers
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
          setPlayingIndex((prev) => (prev === index ? null : prev));
        });
        wavesurferRefs.current[index].on('finish', () => {
          setPlayingIndex((prev) => (prev === index ? null : prev));
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
      
      const sttBaseUrl = (process.env.REACT_APP_STT_URL || 'http://localhost:5000').replace(/\/$/, '');
      const response = await fetch(`${sttBaseUrl}/transcribe`, {
        method: 'POST',
        // Headers removed as auth is no longer required on backend
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
        // Use structured chunks from backend if available (supports Web3 flow)
        if (data.chunks) {
            const updatedTranscript = data.chunks.map((chunk) => {
                // Ensure audio URL is absolute
                let audioUrl = chunk.audio_chunk_url;
                if (audioUrl && audioUrl.startsWith('/')) {
                    audioUrl = `${sttBaseUrl}${audioUrl}`;
                }
                
                return {
                    chunk_index: chunk.chunk_index,
                    timestamp: `${parseFloat(chunk.start_time).toFixed(2)}s - ${parseFloat(chunk.end_time).toFixed(2)}s`,
                    start_time: parseFloat(chunk.start_time).toFixed(2),
                    end_time: parseFloat(chunk.end_time).toFixed(2),
                    speaker: `Speaker ${chunk.speaker.replace('SPEAKER_', '')}`,
                    speakerId: chunk.speaker,
                    text: chunk.transcription_text || '',
                    audio_chunk_url: audioUrl,
                };
            });
            setTranscript(updatedTranscript);
            setHasTranscribed(updatedTranscript.length > 0);
            
            // Automatically trigger secure save flow
            await saveToBlockchain(updatedTranscript);
        } else {
            // Fallback for backward compatibility
            const parsedTranscript = parseTranscript(data.transcript);
            const filtered = parsedTranscript.filter(entry => entry.text && entry.text.trim());
            setTranscript(filtered);
            if (filtered.length > 0) {
                 await saveToBlockchain(filtered);
            }
            setHasTranscribed(filtered.length > 0);
        }
        
        if (typeof setCredit === 'function') {
           // Credit update not needed anymore, keeping logic or removing it depends on if you want to update UI to show "Unlimited" or similar.
           // For now, removing the credit deduction update.
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

  // IPFS & Encryption Helpers
  const uploadToIPFS = async (blob) => {
    try {
        const formData = new FormData();
        formData.append('file', blob);
        // Default local IPFS API port
        const response = await fetch('http://127.0.0.1:5001/api/v0/add', {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('IPFS upload failed. Is your local node running?');
        const data = await response.json();
        return data.Hash;
    } catch (e) {
        console.error("IPFS Upload Error:", e);
        throw e;
    }
  };

  const deriveKey = async (signature) => {
      const enc = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
          "raw",
          enc.encode(signature),
          { name: "PBKDF2" },
          false,
          ["deriveKey"]
      );
      return window.crypto.subtle.deriveKey(
          {
              name: "PBKDF2",
              salt: enc.encode("SonoCanto-Salt"),
              iterations: 100000,
              hash: "SHA-256",
          },
          keyMaterial,
          { name: "AES-GCM", length: 256 },
          false,
          ["encrypt", "decrypt"]
      );
  };

  const encryptAudio = async (blob, key) => {
      const buffer = await blob.arrayBuffer();
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedContent = await window.crypto.subtle.encrypt(
          { name: "AES-GCM", iv: iv },
          key,
          buffer
      );
      // Prepend IV to the encrypted data for decryption later
      const resultBuffer = new Uint8Array(iv.length + encryptedContent.byteLength);
      resultBuffer.set(iv);
      resultBuffer.set(new Uint8Array(encryptedContent), iv.length);
      return new Blob([resultBuffer]);
  };

  const decryptAudio = async (encryptedBlob, key) => {
      const buffer = await encryptedBlob.arrayBuffer();
      // Extract IV (first 12 bytes)
      const iv = buffer.slice(0, 12);
      // Extract data (rest)
      const data = buffer.slice(12);
      
      try {
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: new Uint8Array(iv) },
            key,
            data
        );
        return new Blob([decryptedBuffer], { type: 'audio/wav' });
      } catch (e) {
        console.error("Decryption failed:", e);
        throw new Error("Failed to decrypt audio. Wrong account or signature?");
      }
  };

  const handleLoadFromChain = async () => {
    try {
        if (!window.ethereum) {
            alert('MetaMask is not installed!');
            return;
        }

        setIsLoading(true); // Re-use loading state

        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        const CONTRACT_ADDRESS = "0xcD7faf4C2c2DF26C80490AF9Dc3CeFebA184AD28"; 
        
        // Define ABI with the getter
        const ABI = [
          "function getUserSessions() public view returns (tuple(string sessionId, string userId, uint256 timestamp, tuple(uint256 startTime, uint256 endTime, string speaker, string text, string audioUrl)[] chunks)[])"
        ];
        
        let contract;
        try {
           contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        } catch(e) {
           console.error("Contract setup error", e);
           alert("Failed to connect to contract.");
           setIsLoading(false);
           return;
        }

        // Fetch sessions
        const sessions = await contract.getUserSessions();
        if (!sessions || sessions.length === 0) {
            alert("No sessions found for this address.");
            setIsLoading(false);
            return;
        }

        // Get the latest session
        const latestSession = sessions[sessions.length - 1];
        console.log("Loading session:", latestSession.sessionId);

        // Security Check: Prompt for signature to derive decryption key
        // Note: In a real app, you might want to check IF the audio is encrypted before asking, 
        // but here we assume all chain-saved audio is encrypted as per new flow.
        let key;
        try {
            const signature = await signer.signMessage("Sign this message to generate your encryption key for SonoCanto audio files.");
            key = await deriveKey(signature);
        } catch (err) {
            alert("Signature denied. Cannot decrypt audio.");
            setIsLoading(false);
            return;
        }

        // Process chunks
        const loadedTranscript = [];
        const rawChunks = latestSession.chunks; // This is a specific structure from Ethers

        for (let i = 0; i < rawChunks.length; i++) {
            const chunk = rawChunks[i];
            
            // Convert timestamps (stored as * 100)
            const startStr = (Number(chunk.startTime) / 100).toFixed(2);
            const endStr = (Number(chunk.endTime) / 100).toFixed(2);
            
            let audioBlobUrl = null;
            
            // Handle IPFS URL
            if (chunk.audioUrl && chunk.audioUrl.startsWith('ipfs://')) {
                const cid = chunk.audioUrl.replace('ipfs://', '');
                const gatewayUrl = `http://127.0.0.1:8080/ipfs/${cid}`;
                
                try {
                    const resp = await fetch(gatewayUrl);
                    if (!resp.ok) throw new Error("IPFS Fetch failed");
                    const encryptedBlob = await resp.blob();
                    
                    const decryptedBlob = await decryptAudio(encryptedBlob, key);
                    audioBlobUrl = URL.createObjectURL(decryptedBlob);
                } catch (e) {
                    console.error(`Failed to load/decrypt chunk ${i}:`, e);
                }
            } else if (chunk.audioUrl) {
                // Legacy or direct URL
                audioBlobUrl = chunk.audioUrl;
            }

            loadedTranscript.push({
                chunk_index: i,
                timestamp: `${startStr}s - ${endStr}s`,
                start_time: startStr,
                end_time: endStr,
                speaker: chunk.speaker,
                speakerId: chunk.speaker, // Mapping might be loose here
                text: chunk.text,
                audio_chunk_url: audioBlobUrl
            });
        }

        setTranscript(loadedTranscript);
        setHasTranscribed(true);
        alert("Session loaded and decrypted from Blockchain/IPFS!");

    } catch (e) {
        console.error("Load error:", e);
        alert("Failed to load session details: " + e.message);
    } finally {
        setIsLoading(false);
    }
  };

  const saveToBlockchain = async (transcriptData) => {
      // Use provided data or fallback to state (unlikely in auto-flow)
      const dataToSave = transcriptData || transcript;
      
      try {
          if (!window.ethereum) {
              alert('MetaMask is not installed!');
              return;
          }

          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          // 1. Sign message to derive encryption key
          const signature = await signer.signMessage("Sign this message to generate your encryption key for SonoCanto audio files.");
          const key = await deriveKey(signature);
          
          const CONTRACT_ADDRESS = "0xcD7faf4C2c2DF26C80490AF9Dc3CeFebA184AD28"; // Replace with deployed contract address on Sepolia
          // Minimal ABI for the saveSession function
          const ABI = [
            "function saveSession(string memory _sessionId, string memory _userId, tuple(uint256 startTime, uint256 endTime, string speaker, string text, string audioUrl)[] memory _chunks) public"
          ];
          
          // Connect to the contract
          let contract;
          try {
             contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
          } catch(e) {
             console.error("Contract mismatch", e);
             alert("Contract setup failed. Check console.");
             return;
          }

          // Use wallet address as user ID
          const userId = await signer.getAddress();
          const sessionId = `session_${Date.now()}`;

          // Format chunks for contract with IPFS processing
          const formattedChunks = [];
          
          for (const t of dataToSave) {
              let ipfsHash = "";
              if (t.audio_chunk_url) {
                  try {
                      // Fetch the actual audio data
                      const audioResp = await fetch(t.audio_chunk_url);
                      const audioBlob = await audioResp.blob();
                      
                      // Encrypt
                      const encryptedBlob = await encryptAudio(audioBlob, key);
                      
                      // Upload to IPFS
                      const cid = await uploadToIPFS(encryptedBlob);
                      ipfsHash = `ipfs://${cid}`;
                  } catch (err) {
                      console.error("Failed to process chunk for IPFS:", err);
                      // Fallback or empty if failed
                      ipfsHash = "error_uploading";
                  }
              }

              formattedChunks.push({
                  startTime: Math.floor(parseFloat(t.start_time) * 100),
                  endTime: Math.floor(parseFloat(t.end_time) * 100),
                  speaker: t.speaker,
                  text: t.text,
                  audioUrl: ipfsHash // Store IPFS URI instead of http URL
              });
          }

          const tx = await contract.saveSession(sessionId, userId, formattedChunks);
          alert(`Transaction sent! Hash: ${tx.hash}`);
          await tx.wait();
          alert('Transcription and encrypted audio saved to blockchain/IPFS successfully!');

      } catch (err) {
          console.error("Blockchain save error:", err);
          alert('Failed to save to blockchain. See console for details.');
      }
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
                className="load-chain-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleLoadFromChain}
                aria-label="Load latest from Blockchain"
              >
                Load Latest from Chain
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
      </div>
    </div>
  );
}

export default Transcribe;