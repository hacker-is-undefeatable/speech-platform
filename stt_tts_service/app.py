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
from supabase import create_client, Client
import shutil
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/transcribe": {"origins": "*"}}, support_credentials=True)  # Allow all origins for testing

# Load secrets from environment variables
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
HF_TOKEN = os.environ.get("HF_TOKEN")

if not SUPABASE_URL or not SUPABASE_KEY or not HF_TOKEN:
    raise RuntimeError("Missing required environment variables for credentials.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Transcription model setup
torch.set_num_threads(1)
model_vad, utils = torch.hub.load(repo_or_dir='snakers4/silero-vad', model='silero_vad')
(get_speech_timestamps, _, read_audio, _, _) = utils
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
        pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1", use_auth_token=HF_TOKEN)
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

# Function to upload audio chunk to Supabase Storage and return full URL
def upload_audio_to_supabase(session_id, chunk, chunk_index, sample_rate):
    temp_file = os.path.join(tempfile.gettempdir(), f"chunk_{chunk_index}.wav")
    sf.write(temp_file, chunk, sample_rate)
    file_name = f"sessions/{session_id}/chunks/{chunk_index}.wav"
    try:
        with open(temp_file, 'rb') as f:
            response = supabase.storage.from_('audiofiles').upload(file_name, f, {'contentType': 'audio/wav'})
        os.remove(temp_file)
        # Construct full public URL
        full_url = f"{SUPABASE_URL}/storage/v1/object/public/audiofiles/{file_name}"
        return full_url
    except Exception as e:
        print(f"Upload error for chunk {chunk_index} at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}: {str(e)}")
        os.remove(temp_file)
        raise

# Transcription endpoint
@app.route('/transcribe', methods=['POST'])
def transcribe():
    from datetime import datetime
    session_id = None
    try:
        print(f"Received files at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}: {request.files}")
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        audio_file = request.files['audio']
        print(f"Audio file received at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}: {audio_file.filename}")
        if not audio_file.filename.endswith('.wav'):
            return jsonify({'error': 'Only WAV files are supported'}), 400

        user_id = None
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split("Bearer ")[1]
                user = supabase.auth.get_user(token)
                if user and user.user:
                    user_id = user.user.id
                    print(f"Authenticated user ID at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}: {user_id}")
                else:
                    print(f"Invalid user data from token at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}")
            except Exception as e:
                print(f"Token validation error at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}: {str(e)}")
                return jsonify({'error': 'Invalid or expired token'}), 401

        print(f"User ID at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}: {user_id}")
        temp_dir = tempfile.mkdtemp()
        audio_path = os.path.join(temp_dir, audio_file.filename)
        audio_file.save(audio_path)

        session_id = str(uuid.uuid4())
        session_data = {
            'session_id': session_id,
            'user_id': user_id,
            'title': audio_file.filename,
            'status': 'processing'
        }
        print(f"Inserting session data at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}: {session_data}")
        supabase.table('transcription_sessions').insert(session_data).execute()

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
                sub_segments = apply_vad_to_segment(segment['chunk'], sr, segment['start'], temp_dir, sample_rate)
                for sub_segment in sub_segments:
                    sub_segment['speaker'] = segment['speaker']  # Inherit speaker from parent segment
                final_segments.extend(sub_segments)
            else:
                final_segments.append(segment)

        transcriptions = []
        for i, segment in enumerate(final_segments):
            try:
                chunk = segment['chunk']
                start = segment['start']
                end = segment['end']
                speaker = segment['speaker']

                # Upload chunk to Supabase and save to database regardless of transcription success
                try:
                    chunk_path = upload_audio_to_supabase(session_id, chunk, i, sample_rate)
                    print(chunk_path)
                    chunk_data = {
                        'chunk_id': str(uuid.uuid4()),
                        'session_id': session_id,
                        'chunk_index': i,
                        'transcription_text': None,  # Initialize as None, update if transcription succeeds
                        'start_time': start,
                        'end_time': end,
                        'speaker': speaker,
                        'audio_chunk_url': chunk_path  # Store full URL
                    }
                    supabase.table('transcription_chunks').insert(chunk_data).execute()
                except Exception as e:
                    print(f"Upload failed for chunk {i} at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}: {str(e)}")
                    continue  # Skip to next segment if upload fails

                # Attempt transcription
                try:
                    inputs = processor(chunk, sampling_rate=sr, return_tensors="pt")
                    inputs = {k: v.to(device) for k, v in inputs.items()}
                    with torch.no_grad():
                        outputs = model.generate(**inputs, suppress_tokens=None)
                    transcription = processor.batch_decode(outputs, skip_special_tokens=True)[0]

                    if transcription.strip():
                        # Update transcription_text in the database
                        supabase.table('transcription_chunks').update({
                            'transcription_text': transcription
                        }).eq('session_id', session_id).eq('chunk_index', i).execute()
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
            supabase.table('transcription_sessions').update({'status': 'failed'}).eq('session_id', session_id).execute()
            return jsonify({'error': 'No transcriptions generated due to processing failures'}), 400

        supabase.table('transcription_sessions').update({'status': 'completed'}).eq('session_id', session_id).execute()

        full_transcription = [
            f"[{entry['start']:.2f}s - {entry['end']:.2f}s] Speaker {entry['speaker']}: {entry['transcription']}"
            for entry in sorted(transcriptions, key=lambda x: x['start'])
            if entry['transcription'].strip()  # Only include non-empty transcripts
        ]

        shutil.rmtree(temp_dir)
        return jsonify({'transcript': '\n'.join(full_transcription)})
    except Exception as e:
        print(f"General error at {datetime.now().strftime('%I:%M %p HKT, %b %d, %Y')}: {str(e)}")
        if session_id:
            supabase.table('transcription_sessions').update({'status': 'failed'}).eq('session_id', session_id).execute()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

if __name__ == '__main__':
    host = os.environ.get('HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', '5000'))
    debug = os.environ.get('FLASK_DEBUG', '1') == '1'
    app.run(host=host, port=port, debug=debug)