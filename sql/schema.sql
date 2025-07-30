-- Users table
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password_hash text not null,
  display_name text,
  created_at timestamp default now()
);

-- STT/TTS History
create table speech_history (
  id serial primary key,
  user_id uuid references users(id),
  type text check (type in ('stt', 'tts')),
  input text,
  output text,
  audio_url text,
  created_at timestamp default now()
);

-- Payments
create table payments (
  id serial primary key,
  user_id uuid references users(id),
  amount numeric,
  status text,
  payment_provider text,
  payment_id text,
  created_at timestamp default now()
);