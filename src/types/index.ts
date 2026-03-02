export interface Transcript {
  id: string
  title: string
  date: Date
  duration: number
  status: 'recording' | 'processing' | 'completed' | 'error'
  speakers: Speaker[]
  segments: TranscriptSegment[]
  summary?: string
  actionItems?: string[]
  keywords?: string[]
  source: 'microphone' | 'upload' | 'meeting'
  audioUrl?: string
}

export interface Speaker {
  id: string
  name: string
  color: string
}

export interface TranscriptSegment {
  id: string
  speakerId: string
  text: string
  startTime: number
  endTime: number
  confidence: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: 'free' | 'pro' | 'business'
}

export interface RecordingState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  audioLevel: number
}
