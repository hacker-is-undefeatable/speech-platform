import React, { useState, useEffect, useRef } from 'react';

function blobToBase64(blob) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onloadend = () => res(reader.result.split(',')[1]);
    reader.onerror = rej;
    reader.readAsDataURL(blob);
  });
}

export default function CombinedBiometricsSensor() {
  const BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [label, setLabel] = useState('');
  const mediaRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    // websocket for live sensor alerts
    const wsUrl = BASE.replace(/^http/, 'ws') + '/ws/alerts';
    let ws;
    try {
      ws = new WebSocket(wsUrl);
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          setAlerts((s) => [msg, ...s].slice(0, 30));
        } catch {
          setAlerts((s) => [{ text: e.data }, ...s].slice(0, 30));
        }
      };
      ws.onopen = () => setStatus('Alerts connected');
      ws.onclose = () => setStatus('Alerts disconnected');
      ws.onerror = () => setStatus('Alerts websocket error');
    } catch (err) {
      setStatus('WS init error: ' + err.message);
    }
    return () => ws && ws.close();
  }, [BASE]);

  async function startRecord() {
    setStatus('Requesting microphone...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRef.current = stream;
      recorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      recorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorderRef.current.start();
      setRecording(true);
      setStatus('Recording...');
    } catch (err) {
      setStatus('Mic error: ' + err.message);
    }
  }

  async function stopAndSend(endpoint) {
    if (!recorderRef.current) return;
    recorderRef.current.stop();
    recorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const b64 = await blobToBase64(blob);
      setStatus('Sending to ' + endpoint + '...');
      try {
        const res = await fetch(`${BASE}/biometrics/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(endpoint === 'enroll' ? { audio: b64, label } : { audio: b64 })
        });
        const data = await res.json();
        setStatus('Response: ' + JSON.stringify(data));
      } catch (err) {
        setStatus('Send error: ' + err.message);
      } finally {
        // cleanup
        mediaRef.current && mediaRef.current.getTracks().forEach(t => t.stop());
        recorderRef.current = null;
        mediaRef.current = null;
        setRecording(false);
      }
    };
  }

  return (
    <div style={{ padding: 16 }}>
      <h3>CantoBiometrics + Sensor (combined)</h3>
      <p>Backend: {BASE}</p>

      <section>
        <h4>Enrollment</h4>
        <input placeholder="label (e.g., 阿婆-LEE)" value={label} onChange={(e) => setLabel(e.target.value)} />
        <div>
          {!recording ? (
            <button onClick={startRecord}>Start Recording (speak natural Cantonese)</button>
          ) : (
            <>
              <button onClick={() => stopAndSend('enroll')}>Stop & Enroll</button>
              <button onClick={() => { recorderRef.current && recorderRef.current.stop(); setRecording(false); }}>Cancel</button>
            </>
          )}
        </div>
      </section>

      <section style={{ marginTop: 12 }}>
        <h4>Verify (unlock / emergency trigger)</h4>
        <div>
          <button onClick={startRecord} disabled={recording}>Start Record for Verify</button>
          {recording && <button onClick={() => stopAndSend('verify')}>Stop & Verify</button>}
        </div>
      </section>

      <section style={{ marginTop: 12 }}>
        <h4>Sensor Alerts (live)</h4>
        <div style={{ maxHeight: 220, overflow: 'auto', border: '1px solid #ddd', padding: 8 }}>
          {alerts.length === 0 && <div>No alerts yet</div>}
          {alerts.map((a, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div><strong>{a.type || a.text || 'alert'}</strong> {a.time ? `@${a.time}` : ''}</div>
              <div>{a.msg || a.text || (a.payload ? JSON.stringify(a.payload) : '')}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ marginTop: 12 }}>
        <strong>Status:</strong> {status}
      </div>
    </div>
  );
}