# CantoSub - Cantonese Transcription Platform

> A modern speech-to-text and transcription platform purpose-built for Cantonese

CantoSub is a startup project by HKUST Computer Science students dedicated to breaking down language barriers by providing accurate, efficient Cantonese transcription and translation services. Our platform leverages cutting-edge AI technology to convert Cantonese speech into text with high accuracy, making it ideal for content creators, researchers, and professionals who work with Cantonese audio.

## Features

- **Cantonese Speech-to-Text**: Convert Cantonese audio recordings into accurate text transcriptions
- **Real-time Transcription**: Process audio files and generate transcriptions quickly
- **Text-to-Speech**: Convert Cantonese text back into natural-sounding audio
- **Intuitive Dashboard**: User-friendly interface for managing transcriptions and projects
- **Secure Authentication**: Enterprise-grade security with Firebase/Auth0 integration
- **Payment Integration**: Flexible pricing plans with Stripe integration

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **AI/ML**: OpenAI Whisper (Speech Recognition) + TTS Engine
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Firebase/Auth0
- **Payment Processing**: Stripe
- **Deployment**: Vercel/AWS

## Getting Started

### Prerequisites
- Node.js (v14+)
- Python 3.8+
- npm or yarn

### Installation

#### 1. Backend Setup
```bash
cd backend
npm install
# Create backend/.env (see backend/.env.example)
node app.js
```

#### 2. STT/TTS Service Setup
```bash
cd stt_tts_service
pip install flask openai-whisper TTS
# Create stt_tts_service/.env (see stt_tts_service/.env.example)
python app.py
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
# Create frontend/.env (see frontend/.env.example)
npm start
```

#### 4. Database Initialization
Import the schema into your Supabase PostgreSQL database:
```bash
psql -d your_database -f sql/schema.sql
```

## Project Structure

```
cantosub/
├── backend/          # Express.js API server
├── frontend/         # React application
├── stt_tts_service/  # Python-based speech processing
├── sql/              # Database schemas
└── README.md
```

## Environment Configuration

This repo expects environment variables in each service folder.

Use the templates:
- `backend/.env.example`
- `frontend/.env.example`
- `stt_tts_service/.env.example`

Key variables:

**backend/.env**
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB
JWT_SECRET=change-me
PORT=4000
CLIENT_URL=http://localhost:3000
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

**frontend/.env** (Create React App requires `REACT_APP_` prefix)
```
REACT_APP_SUPABASE_URL=
REACT_APP_SUPABASE_ANON_KEY=
REACT_APP_STT_URL=http://localhost:5000
REACT_APP_BACKEND_URL=http://localhost:4000
```

**stt_tts_service/.env**
```
SUPABASE_URL=
SUPABASE_KEY=
HF_TOKEN=
HOST=0.0.0.0
PORT=5000
```

Important: never commit real keys. `.env` is gitignored.

## How to Run (Local)

Start all 3 services (3 terminals):

**Terminal 1 (Backend)**
```bash
cd backend
npm install
npm start
```

**Terminal 2 (Python STT service)**
```bash
cd stt_tts_service
pip install -r requirements.txt
python app.py
```

**Terminal 3 (Frontend)**
```bash
cd frontend
npm install
npm start
```

Default URLs:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- STT service: http://localhost:5000

## Deployment

- **Frontend**: Deploy to Vercel or AWS S3 + CloudFront
- **Backend**: Deploy to Vercel Serverless Functions, AWS Lambda, or traditional servers
- **STT/TTS Service**: Deploy to AWS Lambda, Google Cloud Run, or Docker containers

## Contributing

We welcome contributions from the community! Please feel free to submit pull requests or open issues for feature suggestions.

## License

Proprietary - All rights reserved

## About

Built with passion by HKUST Computer Science students to bridge the gap in Cantonese language technology.

For inquiries or support, please contact us through the platform.