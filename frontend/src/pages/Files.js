import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './Files.css';

function Files({ isAuthenticated, setIsAuthenticated }) {
  const [sessions, setSessions] = useState([]);
  const [transcripts, setTranscripts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch all transcription sessions for the user
  useEffect(() => {
    const loadSessions = async () => {
      setIsLoading(true);
      setError('');

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError('User not authenticated');
          setIsAuthenticated(false);
          navigate('/login');
          return;
        }

        const { data: sessionData, error: sessionError } = await supabase
          .from('transcription_sessions')
          .select('session_id, created_at')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (sessionError) {
          throw new Error('Error loading sessions: ' + sessionError.message);
        }

        setSessions(sessionData || []);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setError(error.message);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadSessions();
    }
  }, [isAuthenticated, setIsAuthenticated, navigate]);

  // Fetch transcription chunks for a specific session
  const loadTranscriptionChunks = async (sessionId) => {
    try {
      const { data: chunks, error: chunkError } = await supabase
        .from('transcription_chunks')
        .select('*')
        .eq('session_id', sessionId)
        .order('chunk_index', { ascending: true });

      if (chunkError) {
        throw new Error('Error loading chunks: ' + chunkError.message);
      }

      const formattedChunks = chunks.map((chunk) => ({
        chunk_index: chunk.chunk_index,
        timestamp: `${chunk.start_time}s - ${chunk.end_time}s`,
        start_time: chunk.start_time,
        end_time: chunk.end_time,
        speaker: `Speaker ${chunk.speaker.replace('SPEAKER_', '')}`,
        speakerId: chunk.speaker,
        text: chunk.transcription_text || '',
        audio_chunk_url: chunk.audio_chunk_url,
      }));

      setTranscripts((prev) => ({
        ...prev,
        [sessionId]: formattedChunks,
      }));
    } catch (error) {
      console.error('Error fetching chunks:', error);
      setError(error.message);
    }
  };

  // Toggle visibility of transcription details for a session
  const toggleSessionDetails = (sessionId) => {
    if (!transcripts[sessionId]) {
      loadTranscriptionChunks(sessionId);
    } else {
      setTranscripts((prev) => ({
        ...prev,
        [sessionId]: null,
      }));
    }
  };

  return (
    <div className="files-container">
      <h1>Transcription History</h1>
      <p>View your previous transcription sessions below.</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {isLoading ? (
        <p>Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p>No transcription sessions found.</p>
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
                    {new Date(session.created_at).toLocaleString()}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    <button onClick={() => toggleSessionDetails(session.session_id)}>
                      {transcripts[session.session_id] ? 'Hide Details' : 'Show Details'}
                    </button>
                  </td>
                </tr>
                {transcripts[session.session_id] && (
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
                          {transcripts[session.session_id].map((entry, index) => (
                            <tr key={index}>
                              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {entry.timestamp}
                              </td>
                              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {entry.speaker}
                              </td>
                              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {entry.text}
                              </td>
                              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {entry.audio_chunk_url ? (
                                  <audio controls>
                                    <source src={entry.audio_chunk_url} type="audio/wav" />
                                    Your browser does not support the audio element.
                                  </audio>
                                ) : (
                                  <p>No audio available</p>
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