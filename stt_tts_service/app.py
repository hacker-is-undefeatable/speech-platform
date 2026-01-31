from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import librosa
import numpy as np
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq
from pyannote.audio import Pipeline
import soundfile as sf
import os
import tempfile
import uuid
# from supabase import create_client, Client
import shutil
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

# Initialize Flask app
app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/*": {"origins": "*"}}, support_credentials=True)

# Ensure static directory exists for temporary audio serving
# Use absolute path to avoid issues with CWD or spaces
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_AUDIO_DIR = os.path.join(BASE_DIR, 'static', 'audio_chunks')
if not os.path.exists(STATIC_AUDIO_DIR):
    os.makedirs(STATIC_AUDIO_DIR)

# Transcription model setup
torch.set_num_threads(1)
model_vad, utils = torch.hub.load(repo_or_dir='snakers4/silero-vad', model='silero_vad', trust_repo=True)
(get_speech_timestamps, get_number_ts, read_audio, _, process_chunk) = utils
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
processor = AutoProcessor.from_pretrained("simonl0909/whisper-large-v2-cantonese")
model = AutoModelForSpeechSeq2Seq.from_pretrained("simonl0909/whisper-large-v2-cantonese").to(device)

# Function to apply VAD to a long segment
def apply_vad_to_segment(chunk, chunk_start, temp_dir, sample_rate=16000):
    try:
        temp_file = os.path.join(temp_dir, f"temp_chunk_{chunk_start:.2f}.wav")
        sf.write(temp_file, chunk, sample_rate)
        wav = read_audio(temp_file, sampling_rate=sample_rate)
        speech_timestamps = get_speech_timestamps(wav, model_vad, sampling_rate=sample_rate, return_seconds=True)
        sub_segments = []
        for segment in speech_timestamps:
            start = chunk_start + segment['start']
            end = chunk_start + segment['end']
            sub_start = int(segment['start'] * sample_rate)
            sub_end = int(segment['end'] * sample_rate)
            sub_chunk = chunk[sub_start:sub_end]
            sub_segments.append({
                'chunk': sub_chunk,
                'start': start,
                'end': end
            })
        os.remove(temp_file)
        print(f"VAD split at {chunk_start:.2f}s into {len(sub_segments)} sub-segments")
        return sub_segments
    except Exception as e:
        print(f"VAD error at {chunk_start:.2f}s: {str(e)}")
        return [{'chunk': chunk, 'start': chunk_start, 'end': chunk_start + len(chunk)/sample_rate}]

# Function to perform speaker diarization and extract segments
def get_speaker_segments(audio_path, sample_rate=16000, num_speakers=None):
    try:
        audio, sr = librosa.load(audio_path, sr=sample_rate)
        pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1")
        pipeline.to(device)
        if num_speakers:
            diarization = pipeline(audio_path, num_speakers=num_speakers)
        else:
            diarization = pipeline(audio_path)
        segments = []
        for turn, _, speaker in diarization.itertracks(yield_label=True):
            start = turn.start
            end = turn.end
            start_idx = int(start * sample_rate)
            end_idx = int(end * sample_rate)
            chunk = audio[start_idx:end_idx] if start_idx < len(audio) and end_idx <= len(audio) else audio[start_idx:]
            segments.append({
                'chunk': chunk,
                'start': start,
                'end': end,
                'speaker': speaker
            })
        print(f"Diarized {len(segments)} segments")
        return segments, sr
    except Exception as e:
        print(f"Diarization error at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}: {str(e)}")
        raise

# Function to upload audio chunk (REMOVED SUPABASE)
def upload_audio_to_supabase(session_id, chunk, chunk_index, sample_rate):
    return None

# Transcription endpoint
@app.route('/transcribe', methods=['POST'])
def transcribe():
    from datetime import datetime
    session_id = str(uuid.uuid4())
    try:
        print(f"Received files at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}: {request.files}")
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        audio_file = request.files['audio']
        if not audio_file.filename:
            return jsonify({'error': 'No filename provided'}), 400
        print(f"Audio file received at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}: {audio_file.filename}")
        if not audio_file.filename.endswith('.wav'):
            return jsonify({'error': 'Only WAV files are supported'}), 400

        temp_dir = tempfile.mkdtemp()
        audio_path = os.path.join(temp_dir, audio_file.filename)
        audio_file.save(audio_path)

        sample_rate = 16000
        num_speakers = request.form.get('num_speakers', type=int)
        try:
            segments, sr = get_speaker_segments(audio_path, sample_rate=sample_rate, num_speakers=num_speakers)
        except Exception as e:
            print(f"Speaker diarization failed at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}: {str(e)}")
            return jsonify({'error': f'Speaker diarization failed: {str(e)}'}), 500

        final_segments = []
        for segment in segments:
            duration = segment['end'] - segment['start']
            if duration > 30:
                print(f"Segment {segment['start']:.2f}s to {segment['end']:.2f}s exceeds 30s, applying VAD")
                sub_segments = apply_vad_to_segment(segment['chunk'], segment['start'], temp_dir, sample_rate=sample_rate)
                for sub_segment in sub_segments:
                    sub_segment['speaker'] = segment['speaker']  # Inherit speaker from parent segment
                final_segments.extend(sub_segments)
            else:
                final_segments.append(segment)

        transcriptions = []
        chunks_data = [] 
        for i, segment in enumerate(final_segments):
            try:
                chunk = segment['chunk']
                start = segment['start']
                end = segment['end']
                speaker = segment['speaker']
                
                # Save chunk locally to serve to frontend for IPFS upload
                chunk_filename = f"{session_id}_chunk_{i}.wav"
                local_chunk_path = os.path.join(STATIC_AUDIO_DIR, chunk_filename)
                
                # Ensure data is contiguous and float32 (libsndfile preference)
                if not isinstance(chunk, np.ndarray):
                    chunk = np.array(chunk)
                if not chunk.flags['C_CONTIGUOUS']:
                    chunk = np.ascontiguousarray(chunk)
                
                try:
                    sf.write(local_chunk_path, chunk, sr)
                except Exception as write_err:
                    print(f"sf.write failed: {write_err}. Trying alternate path resolution.")
                    # Fallback or retry?
                    # On Windows, sometimes absolute paths with spaces act up in some libraries.
                    # But Python usually handles it.
                    raise write_err
                
                # Construct URL (assuming basic localhost setup or relative path)
                # Frontend will interpret this relative to its knowledge or we send full path if we know host
                # Using relative path "/static/audio_chunks/..." which frontend can resolve against backend URL
                chunk_path = f"/static/audio_chunks/{chunk_filename}"

                # Attempt transcription
                try:
                    inputs = processor(chunk, sampling_rate=sr, return_tensors="pt")
                    inputs = {k: v.to(device) for k, v in inputs.items()}
                    with torch.no_grad():
                        outputs = model.generate(**inputs, suppress_tokens=None)
                    transcription = processor.batch_decode(outputs, skip_special_tokens=True)[0]

                    if transcription.strip():
                        # Collect data for return
                        chunks_data.append({
                            'chunk_index': i,
                            'transcription_text': transcription,
                            'start_time': start,
                            'end_time': end,
                            'speaker': speaker,
                            'audio_chunk_url': chunk_path
                        })
                        transcriptions.append({
                            'speaker': speaker,
                            'transcription': transcription,
                            'start': start,
                            'end': end
                        })
                except Exception as e:
                    print(f"Transcription error for segment {i} at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}: {str(e)}")
                    continue

            except Exception as e:
                print(f"General error for segment {i} at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}: {str(e)}")
                continue

        if not transcriptions:
            # supabase.table('transcription_sessions').update({'status': 'failed'}).eq('session_id', session_id).execute()
            return jsonify({'error': 'No transcriptions generated due to processing failures'}), 400

        # supabase.table('transcription_sessions').update({'status': 'completed'}).eq('session_id', session_id).execute()

        full_transcription = [
            f"[{entry['start']:.2f}s - {entry['end']:.2f}s] Speaker {entry['speaker']}: {entry['transcription']}"
            for entry in sorted(transcriptions, key=lambda x: x['start'])
            if entry['transcription'].strip()
        ]

        shutil.rmtree(temp_dir)
        return jsonify({
            'transcript': '\n'.join(full_transcription),
            'chunks': chunks_data, # Return structural data for frontend blockchain save
            'session_id': session_id
        })
    except Exception as e:
        print(f"General error at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}: {str(e)}")
        # if session_id:
            # supabase.table('transcription_sessions').update({'status': 'failed'}).eq('session_id', session_id).execute()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

if __name__ == '__main__':
    host = os.environ.get('HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', '5000'))
    debug = os.environ.get('FLASK_DEBUG', '1') == '1'
    # Ensure raw static file serving is enabled for dev
    app.run(host=host, port=port, debug=debug)