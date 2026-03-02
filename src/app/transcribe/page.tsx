'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Mic, MicOff, Pause, Play, Square, Upload, Clock,
  Sparkles, Users, ChevronDown, Volume2, AlertCircle
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { useTranscription } from '@/hooks/useTranscription'
import { cn, formatDuration } from '@/lib/utils'

export default function TranscribePage() {
  const router = useRouter()
  const {
    isRecording, isPaused, duration, segments, speakers,
    interimText, audioLevel, startRecording, stopRecording,
    pauseRecording, resumeRecording, isSupported
  } = useTranscription()

  const [mode, setMode] = useState<'record' | 'upload'>('record')
  const [language, setLanguage] = useState('en-US')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const transcriptEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [segments, interimText])

  const handleStop = () => {
    stopRecording()
    // Navigate to transcript view
    router.push('/transcript/new')
  }

  const handleUpload = () => {
    if (!uploadFile) return
    setIsProcessing(true)
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      router.push('/transcript/new')
    }, 3000)
  }

  const getSpeakerById = (id: string) => speakers.find(s => s.id === id)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => setMode('record')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
            mode === 'record' ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
          )}
        >
          <Mic size={16} /> Record
        </button>
        <button
          onClick={() => setMode('upload')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
            mode === 'upload' ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
          )}
        >
          <Upload size={16} /> Upload
        </button>
      </div>

      {mode === 'record' ? (
        <>
          {!isSupported && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Browser not supported</p>
                <p className="text-xs text-amber-600 mt-1">Please use Chrome, Edge, or Safari for real-time transcription.</p>
              </div>
            </div>
          )}

          {/* Recording Controls */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            {/* Waveform Visualization */}
            <div className="h-32 bg-gray-950 flex items-center justify-center relative overflow-hidden">
              {isRecording ? (
                <div className="flex items-center gap-1 h-full px-8">
                  {Array.from({ length: 40 }).map((_, i) => {
                    const height = isRecording && !isPaused
                      ? Math.max(8, Math.random() * 80 * audioLevel + 10)
                      : 8
                    return (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-gradient-to-t from-brand-500 to-accent-400 transition-all duration-100"
                        style={{ height: `${height}%` }}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="text-center">
                  <Mic size={32} className="text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Ready to record</p>
                </div>
              )}

              {/* Duration overlay */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className={cn('w-3 h-3 rounded-full', isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse')} />
                  <span className="text-white text-sm font-mono font-medium">{formatDuration(duration)}</span>
                </div>
              )}

              {/* Language selector */}
              <div className="absolute top-4 right-4">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-white/10 text-white text-xs rounded-lg px-3 py-1.5 border border-white/20 focus:outline-none cursor-pointer"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                  <option value="ja-JP">Japanese</option>
                  <option value="zh-CN">Chinese</option>
                  <option value="hi-IN">Hindi</option>
                  <option value="pt-BR">Portuguese</option>
                  <option value="ar-SA">Arabic</option>
                </select>
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 flex items-center justify-center gap-6">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={!isSupported}
                  className="w-20 h-20 rounded-full gradient-bg text-white flex items-center justify-center shadow-xl shadow-brand-600/30 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mic size={32} />
                </button>
              ) : (
                <>
                  <button
                    onClick={isPaused ? resumeRecording : pauseRecording}
                    className="w-14 h-14 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    {isPaused ? <Play size={22} /> : <Pause size={22} />}
                  </button>
                  <button
                    onClick={handleStop}
                    className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-500/30 hover:bg-red-600 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Square size={28} fill="white" />
                  </button>
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <Volume2 size={22} className="text-gray-400" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Live Transcript */}
          {(segments.length > 0 || interimText) && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-brand-600" />
                  <h2 className="text-sm font-semibold text-gray-900">Live Transcript</h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users size={14} />
                  {speakers.length} speaker{speakers.length !== 1 ? 's' : ''} detected
                </div>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto space-y-4">
                {segments.map((segment) => {
                  const speaker = getSpeakerById(segment.speakerId)
                  return (
                    <div key={segment.id} className="flex gap-3 animate-fade-in">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: speaker?.color || '#6b7280' }}
                      >
                        {speaker?.name.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-gray-900">{speaker?.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {formatDuration(segment.startTime)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{segment.text}</p>
                      </div>
                    </div>
                  )
                })}

                {interimText && (
                  <div className="flex gap-3 opacity-60">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      ?
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 italic">{interimText}</p>
                    </div>
                  </div>
                )}
                <div ref={transcriptEndRef} />
              </div>
            </div>
          )}
        </>
      ) : (
        /* Upload Mode */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all',
              uploadFile ? 'border-brand-300 bg-brand-50' : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,video/*"
              className="hidden"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            />
            {uploadFile ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
                  <Upload size={28} className="text-brand-600" />
                </div>
                <p className="font-medium text-gray-900 mb-1">{uploadFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(uploadFile.size / 1024 / 1024).toFixed(1)} MB &middot; Click to change
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Upload size={28} className="text-gray-400" />
                </div>
                <p className="font-medium text-gray-900 mb-1">Drop your file here or click to browse</p>
                <p className="text-sm text-gray-500">MP3, WAV, MP4, M4A, WebM, OGG &middot; Max 500MB</p>
              </>
            )}
          </div>

          {/* Language selection for upload */}
          <div className="mt-6 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="auto">Auto Detect</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="ja-JP">Japanese</option>
              <option value="zh-CN">Chinese</option>
            </select>
          </div>

          {uploadFile && (
            <div className="mt-6">
              <Button onClick={handleUpload} className="w-full" isLoading={isProcessing}>
                <Sparkles size={16} />
                {isProcessing ? 'Transcribing...' : 'Transcribe File'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
