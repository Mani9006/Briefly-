# Briefly

AI-Powered Transcription & Meeting Notes

Transform conversations into actionable insights with real-time transcription, AI summaries, speaker identification, and smart meeting notes.

## Features

- **Real-Time Transcription** - Live transcription with 95%+ accuracy using Web Speech API
- **AI Summaries** - Automatic meeting summaries, key takeaways, and action items
- **Speaker Identification** - Automatically detect and label different speakers
- **Three-Tab Viewer** - Minutes (AI summary), Transcript (full text), Chat (ask AI about your meeting)
- **Audio & Video Upload** - Upload recordings in any format (MP3, WAV, MP4, M4A)
- **Smart Search** - Search across all your transcripts instantly
- **Export Anywhere** - Export as PDF, TXT, or share via link
- **Multi-Language** - Support for 30+ languages with auto-detection

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Transcription**: Web Speech API (real-time), with hooks for Deepgram/AssemblyAI
- **AI**: Integration-ready for OpenAI GPT-4o summaries and chat

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/login/           # Login page
│   ├── auth/signup/          # Signup page
│   ├── dashboard/            # Dashboard with transcript library
│   ├── transcribe/           # Real-time recording & file upload
│   ├── transcript/[id]/      # Transcript viewer (Minutes/Transcript/Chat)
│   └── settings/             # Settings page
├── components/
│   ├── ui/                   # Button, shared UI components
│   └── layout/               # Navbar, Footer, AppShell, Logo
├── hooks/
│   └── useTranscription.ts   # Web Speech API transcription hook
├── lib/
│   └── utils.ts              # Utility functions
└── types/
    └── index.ts              # TypeScript types
```

## License

MIT
