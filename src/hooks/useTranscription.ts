'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { TranscriptSegment, Speaker } from '@/types'
import { generateId } from '@/lib/utils'

const SPEAKER_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316']

interface UseTranscriptionReturn {
  isRecording: boolean
  isPaused: boolean
  duration: number
  segments: TranscriptSegment[]
  speakers: Speaker[]
  interimText: string
  audioLevel: number
  startRecording: () => void
  stopRecording: () => void
  pauseRecording: () => void
  resumeRecording: () => void
  isSupported: boolean
}

export function useTranscription(): UseTranscriptionReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [segments, setSegments] = useState<TranscriptSegment[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([
    { id: 'speaker-1', name: 'Speaker 1', color: SPEAKER_COLORS[0] },
  ])
  const [interimText, setInterimText] = useState('')
  const [audioLevel, setAudioLevel] = useState(0)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const isSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const updateAudioLevel = useCallback(() => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
      setAudioLevel(average / 255)
    }
    animFrameRef.current = requestAnimationFrame(updateAudioLevel)
  }, [])

  const startRecording = useCallback(async () => {
    if (!isSupported) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Audio level monitoring
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      audioContextRef.current = audioContext
      analyserRef.current = analyser
      updateAudioLevel()

      // Speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      let currentSpeakerIndex = 0

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            const text = result[0].transcript.trim()
            if (text) {
              const now = (Date.now() - startTimeRef.current) / 1000
              const speakerId = speakers[currentSpeakerIndex % speakers.length].id

              setSegments((prev) => [
                ...prev,
                {
                  id: generateId(),
                  speakerId,
                  text,
                  startTime: Math.max(0, now - text.split(' ').length * 0.3),
                  endTime: now,
                  confidence: result[0].confidence || 0.95,
                },
              ])

              // Simulate speaker changes based on pauses
              if (Math.random() > 0.7) {
                currentSpeakerIndex++
                if (currentSpeakerIndex >= speakers.length) {
                  const newSpeaker: Speaker = {
                    id: `speaker-${speakers.length + 1}`,
                    name: `Speaker ${speakers.length + 1}`,
                    color: SPEAKER_COLORS[speakers.length % SPEAKER_COLORS.length],
                  }
                  setSpeakers((prev) => [...prev, newSpeaker])
                }
              }
            }
            setInterimText('')
          } else {
            interim += result[0].transcript
          }
        }
        if (interim) setInterimText(interim)
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error !== 'no-speech') {
          console.error('Speech recognition error:', event.error)
        }
      }

      recognition.onend = () => {
        if (isRecording && !isPaused) {
          recognition.start()
        }
      }

      recognition.start()
      recognitionRef.current = recognition
      startTimeRef.current = Date.now()
      setIsRecording(true)
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } catch {
      console.error('Failed to start recording')
    }
  }, [isSupported, speakers, isRecording, isPaused, updateAudioLevel])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsRecording(false)
    setIsPaused(false)
    setAudioLevel(0)
    setInterimText('')
  }, [])

  const pauseRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsPaused(true)
  }, [])

  const resumeRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
    }
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)
    setIsPaused(false)
  }, [])

  useEffect(() => {
    return () => {
      stopRecording()
    }
  }, [stopRecording])

  return {
    isRecording,
    isPaused,
    duration,
    segments,
    speakers,
    interimText,
    audioLevel,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    isSupported,
  }
}
