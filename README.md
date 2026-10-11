# BitChord Web — A Modern YouTube Music Player

BitChord Web is a full-featured, responsive, high-performance music player web application inspired by the open-source **BitChord** project (originally by Kushagra Singh). It enables seamless YouTube music search, TOS-compliant video playback, playlist creation & queue management, and AI-powered music discovery powered by Gemini.

---

## 🎧 Features

1. **Dashboard Home**: Dynamic greeting, quick-access music stations, recently played carousel, trending YouTube tracks, and featured artists.
2. **Universal YouTube Search**: Search by song title, artist, album, or keywords with instant playback, add-to-queue, and add-to-playlist controls. Supports YouTube Data API v3 with automatic fallback to curated high-fidelity catalogue if quota is reached or no key is configured.
3. **Explore & Stations**: Curated mood stations (Deep Coding & Flow, Midnight Synth Drive, Heavy Workout Iron, Coffeehouse Acoustic) and genre exploration cards.
4. **Your Library**: Unified library hub with playlists, liked songs count, listening history, and cloud/offline storage indicator.
5. **Personal Playlists**: Create, rename, delete, reorder tracks (move up/down), custom artwork, and instant 1-click play or shuffle.
6. **Favorites & Liked Songs**: 1-click heart toggle, persisted across sessions with Play All and Shuffle All.
7. **Recently Played**: Track and review listening history with relative timestamps and clear history controls.
8. **AI Music Discovery (Gemini 3.8 Flash)**: Natural language music curation — discover songs by mood, activity, or aesthetic, with 1-click playlist generation and playback.
9. **TOS-Compliant YouTube IFrame Player**: Official YouTube Player API with docked picture-in-picture mode, expanded now-playing canvas, seekbar, volume controls, shuffle, and repeat modes.
10. **Persistent Storage & Supabase Sync**: Fully operational out-of-the-box for guest users via `localStorage`, with optional Supabase cloud sync & Google OAuth for cross-device synchronization.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Motion
- **Backend**: Express.js with Vite middleware / Next.js ready
- **Music Playback**: Official YouTube IFrame Player API (`window.YT.Player`)
- **Public Search**: Official YouTube Data API v3 + Curated high-fidelity fallback catalogue
- **AI Engine**: Google Gemini API (`@google/genai`, model `gemini-3.8-flash`)
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Google OAuth
- **Deployment**: Vercel & Node.js

---

## 🚀 Environment Variables

Copy `.env.example` to `.env`:

```env
# Gemini API Key (Server-side AI Discovery)
GEMINI_API_KEY=""

# YouTube Data API v3 Key (Public search & trending videos)
YOUTUBE_API_KEY=""

# Supabase (Optional: Cloud playlists & Google OAuth)
VITE_SUPABASE_URL=""
VITE_SUPABASE_ANON_KEY=""

# App URL & Port
APP_URL="http://localhost:3000"
PORT="3000"
```

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 🗄️ Supabase Database Setup

To enable user accounts and cross-device cloud sync:
1. Create a project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in the Supabase Dashboard.
3. Paste and run the SQL migration script located in `supabase/schema.sql`.
4. Copy your **Project URL** and **Anon Key** into `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. (Optional) In **Authentication > Providers > Google**, enable Google OAuth and add your Google Cloud OAuth Client ID and Secret.

---

## 🚢 Vercel Deployment Guide

1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New > Project** and import the repository.
3. In **Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `YOUTUBE_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy! Vercel will automatically build the client using Vite and deploy serverless endpoints.

---

## 📜 License & Attribution

The original BitChord repository is licensed under **GPL-3.0** by Kushagra Singh (https://github.com/kushagrasinghx/BitChord). This web implementation is an independent, clean-room modern web player built with React, official YouTube IFrame Player API, and Gemini AI. All playback is performed through the official YouTube IFrame Player in compliance with YouTube Developer Terms of Service.
