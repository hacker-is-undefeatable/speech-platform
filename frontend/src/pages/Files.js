import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; 
import { ethers } from 'ethers';
import './Files.css';

function Files({ isAuthenticated, setIsAuthenticated }) {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadSessionsFromChain = async () => {
      setIsLoading(true);
      setError('');

      try {
        if (!window.ethereum) {
           setError("MetaMask not installed");
           return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const CONTRACT_ADDRESS = "0xcD7faf4C2c2DF26C80490AF9Dc3CeFebA184AD28"; 
        
        // Use the explicit tuple syntax which matches Transcribe.js and is more reliable in Ethers v6 for this correct
        const ABI = [
          "function getUserSessions() public view returns (tuple(string sessionId, string userId, uint256 timestamp, tuple(uint256 startTime, uint256 endTime, string speaker, string text, string audioUrl)[] chunks)[])"
        ];

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        const userSessions = await contract.getUserSessions();

        // userSessions is a Proxy array. We need to format it.
        const formattedSessions = userSessions.map(s => {
            const timestamp = Number(s.timestamp);
            return {
                session_id: s.sessionId,
                timestampRaw: timestamp,
                created_at: new Date(timestamp * 1000).toLocaleString(),
                chunks: s.chunks.map(c => ({
                    start_time: Number(c.startTime) / 100,
                    end_time: Number(c.endTime) / 100,
                    speaker: c.speaker,
                    text: c.text,
                    audioUrl: c.audioUrl
                }))
            };
        });

        // Sort by timestamp desc
        formattedSessions.sort((a, b) => b.timestampRaw - a.timestampRaw);
        setSessions(formattedSessions);

      } catch (error) {
        console.error('Error fetching sessions from blockchain:', error);
        setError("Failed to load sessions from blockchain. Ensure you are on Sepolia and referring to the correct contract address.");
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadSessionsFromChain();
    }
  }, [isAuthenticated, navigate]);

  // Toggle details (local state management since we have all data)
  const [expandedSessions, setExpandedSessions] = useState({});
  const [decryptedAudioUrls, setDecryptedAudioUrls] = useState({}); // Map sessionId -> { chunkIndex -> blobUrl }

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

  const decryptAudio = async (encryptedBlob, key) => {
      const buffer = await encryptedBlob.arrayBuffer();
      const iv = buffer.slice(0, 12);
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
        throw e;
      }
  };

  const handleDecryptSession = async (session) => {
      try {
          if (!window.ethereum) return alert("MetaMask required");
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          
          const signature = await signer.signMessage("Sign this message to generate your encryption key for SonoCanto audio files.");
          const key = await deriveKey(signature);

          const newUrls = {};
          
          for (let i = 0; i < session.chunks.length; i++) {
              const chunk = session.chunks[i];
              if (chunk.audioUrl && chunk.audioUrl.startsWith('ipfs://')) {
                  const cid = chunk.audioUrl.replace('ipfs://', '');
                  const gatewayUrl = `http://127.0.0.1:8080/ipfs/${cid}`;
                  try {
                      const res = await fetch(gatewayUrl);
                      const blob = await res.blob();
                      const decrypted = await decryptAudio(blob, key);
                      newUrls[i] = URL.createObjectURL(decrypted);
                  } catch (e) {
                      console.error("Failed to decrypt chunk", i, e);
                  }
              }
          }
          
          setDecryptedAudioUrls(prev => ({
              ...prev,
              [session.session_id]: newUrls
          }));

      } catch (e) {
          alert("Decryption failed or cancelled.");
      }
  };

  const toggleSessionDetails = (sessionId) => {
      setExpandedSessions(prev => ({
          ...prev,
          [sessionId]: !prev[sessionId]
      }));
  };

  return (
    <div className="files-container">
      <h1>Transcription History (Blockchain)</h1>
      <p>View your previous transcription sessions stored on Sepolia.</p>
      
      {error && <p className="error-message">{error}</p>}
      
      {isLoading ? (
        <p>Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p>No transcription sessions found on blockchain.</p>
      ) : (
        <div className="files-table-container">
          <table className="files-table">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <React.Fragment key={session.session_id}>
                  <tr>
                    <td>
                      {session.session_id}
                    </td>
                    <td>
                      {session.created_at}
                    </td>
                    <td>
                      <button 
                        className="action-btn toggle-btn"
                        onClick={() => toggleSessionDetails(session.session_id)}
                      >
                        {expandedSessions[session.session_id] ? 'Hide Details' : 'Show Details'}
                      </button>
                      {expandedSessions[session.session_id] && (
                          <button 
                              className="action-btn unlock-btn"
                              onClick={() => handleDecryptSession(session)}
                          >
                              Unlock Audio
                          </button>
                      )}
                    </td>
                  </tr>
                  {expandedSessions[session.session_id] && (
                    <tr className="details-row">
                      <td colSpan="3">
                        <div className="details-container">
                          <table className="details-table">
                            <thead>
                              <tr>
                                <th>Timestamp</th>
                                <th>Speaker</th>
                                <th>Transcription</th>
                                <th>Audio</th>
                              </tr>
                            </thead>
                            <tbody>
                              {session.chunks.map((entry, index) => {
                                 const decryptedUrl = decryptedAudioUrls[session.session_id]?.[index];
                                 return (
                                <tr key={index}>
                                  <td>
                                    {entry.start_time.toFixed(2)}s - {entry.end_time.toFixed(2)}s
                                  </td>
                                  <td>
                                    {entry.speaker}
                                  </td>
                                  <td>
                                    {entry.text}
                                  </td>
                                  <td>
                                    {decryptedUrl ? (
                                      <audio controls style={{height: '30px'}}>
                                        <source src={decryptedUrl} type="audio/wav" />
                                      </audio>
                                    ) : entry.audioUrl ? (
                                        <span className="audio-label">
                                            {entry.audioUrl.startsWith('ipfs://') ? 'Encrypted (Unlock to play)' : 'Standard Audio'}
                                        </span>
                                    ) : (
                                      <p className="audio-label">No audio</p>
                                    )}
                                  </td>
                                </tr>
                              )})}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Files;