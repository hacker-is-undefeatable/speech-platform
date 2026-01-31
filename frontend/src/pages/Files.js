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

        const CONTRACT_ADDRESS = "0xYourContractAddressHere"; // Replaced with deployed contract address
        // Note: The user must update this address in both Transcribe.js and Files.js
        const ABI = [
            "struct Chunk { uint256 startTime; uint256 endTime; string speaker; string text; string audioUrl; }",
            "struct Session { string sessionId; string userId; uint256 timestamp; Chunk[] chunks; }",
            "function getUserSessions() public view returns (Session[] memory)"
        ];

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        const userSessions = await contract.getUserSessions();
        
        // userSessions is a Proxy array (Result). We need to format it.
        const formattedSessions = userSessions.map(s => ({
            session_id: s.sessionId,
            created_at: new Date(Number(s.timestamp) * 1000).toLocaleString(),
            chunks: s.chunks.map(c => ({
                start_time: Number(c.startTime) / 100,
                end_time: Number(c.endTime) / 100,
                speaker: c.speaker,
                text: c.text,
                audioUrl: c.audioUrl
            }))
        }));

        // Sort by date desc (if not already)
        formattedSessions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Session ID</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Created At</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <React.Fragment key={session.session_id}>
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {session.session_id}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {session.created_at}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    <button onClick={() => toggleSessionDetails(session.session_id)}>
                      {expandedSessions[session.session_id] ? 'Hide Details' : 'Show Details'}
                    </button>
                  </td>
                </tr>
                {expandedSessions[session.session_id] && (
                  <tr>
                    <td colSpan="3" style={{ padding: '0' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0' }}>
                        <thead>
                          <tr>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Timestamp</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Speaker</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Transcription</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Audio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {session.chunks.map((entry, index) => (
                            <tr key={index}>
                              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {entry.start_time.toFixed(2)}s - {entry.end_time.toFixed(2)}s
                              </td>
                              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {entry.speaker}
                              </td>
                              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {entry.text}
                              </td>
                              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {entry.audioUrl ? (
                                  <audio controls style={{height: '30px'}}>
                                    <source src={entry.audioUrl} type="audio/wav" />
                                  </audio>
                                ) : (
                                  <p>No audio</p>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Files;