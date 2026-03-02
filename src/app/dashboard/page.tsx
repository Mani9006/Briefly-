'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search, Plus, Mic, Upload, Youtube, Link2, MoreHorizontal,
  Clock, Calendar, Tag, Filter, Grid3X3, List, Sparkles,
  FileAudio, Trash2, Share2, Pencil, X, ChevronDown
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn, formatRelativeTime, formatDuration } from '@/lib/utils'

// Demo transcript data
const demoTranscripts = [
  {
    id: '1',
    title: 'Weekly Product Standup',
    date: new Date(Date.now() - 1000 * 60 * 30),
    duration: 1847,
    source: 'microphone' as const,
    status: 'completed' as const,
    speakerCount: 4,
    summary: 'Discussed Q1 roadmap priorities, assigned action items for design review.',
    tags: ['product', 'weekly'],
  },
  {
    id: '2',
    title: 'Client Discovery Call - Acme Corp',
    date: new Date(Date.now() - 1000 * 60 * 60 * 3),
    duration: 2456,
    source: 'upload' as const,
    status: 'completed' as const,
    speakerCount: 3,
    summary: 'Client needs API integration. Budget approved for Phase 1. Follow-up scheduled.',
    tags: ['client', 'sales'],
  },
  {
    id: '3',
    title: 'Engineering Architecture Review',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    duration: 3621,
    source: 'microphone' as const,
    status: 'completed' as const,
    speakerCount: 5,
    summary: 'Decided on microservices approach. Migration plan set for next sprint.',
    tags: ['engineering'],
  },
  {
    id: '4',
    title: 'User Interview - Beta Feedback',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48),
    duration: 1235,
    source: 'upload' as const,
    status: 'completed' as const,
    speakerCount: 2,
    summary: 'Users love the search feature but want better export options.',
    tags: ['research', 'feedback'],
  },
  {
    id: '5',
    title: 'Marketing Strategy Planning',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72),
    duration: 2890,
    source: 'microphone' as const,
    status: 'completed' as const,
    speakerCount: 3,
    summary: 'New campaign launching March 15. Content calendar reviewed and approved.',
    tags: ['marketing'],
  },
]

const allTags = ['all', 'product', 'weekly', 'client', 'sales', 'engineering', 'research', 'feedback', 'marketing']

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewSheet, setShowNewSheet] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [activeTag, setActiveTag] = useState('all')
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const filteredTranscripts = demoTranscripts.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = activeTag === 'all' || t.tags.includes(activeTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-950">My Transcripts</h1>
          <p className="text-sm text-gray-500 mt-1">{demoTranscripts.length} recordings &middot; 245 min used of 300 min</p>
        </div>
        <Button onClick={() => setShowNewSheet(true)} className="hidden sm:inline-flex">
          <Plus size={18} />
          New Recording
        </Button>
      </div>

      {/* Usage Bar */}
      <div className="mb-6 p-4 bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Monthly Usage</span>
          <span className="text-sm text-gray-500">245 / 300 minutes</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all" style={{ width: '82%' }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">Resets in 28 days &middot; <Link href="/settings" className="text-brand-600 hover:text-brand-700">Upgrade for unlimited</Link></p>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes and transcripts..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="hidden sm:flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
          <button
            onClick={() => setViewMode('list')}
            className={cn('p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400')}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={cn('p-2 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400')}
          >
            <Grid3X3 size={16} />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
              activeTag === tag
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600'
            )}
          >
            {tag === 'all' ? 'All' : `#${tag}`}
          </button>
        ))}
        <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-brand-600 border border-dashed border-brand-300 hover:bg-brand-50 whitespace-nowrap transition-all">
          <span className="flex items-center gap-1"><Plus size={12} /> Create tag</span>
        </button>
      </div>

      {/* Transcript List */}
      <div className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
          : 'space-y-3'
      )}>
        {filteredTranscripts.map((transcript) => (
          <Link key={transcript.id} href={`/transcript/${transcript.id}`}>
            <div className={cn(
              'group bg-white rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-md hover:shadow-brand-50 transition-all duration-200 relative',
              viewMode === 'grid' ? 'p-5' : 'p-4 flex items-center gap-4'
            )}>
              {/* Icon */}
              <div className={cn(
                'flex-shrink-0 rounded-xl flex items-center justify-center',
                transcript.source === 'microphone'
                  ? 'bg-brand-50 text-brand-600'
                  : 'bg-purple-50 text-purple-600',
                viewMode === 'grid' ? 'w-12 h-12 mb-3' : 'w-10 h-10'
              )}>
                {transcript.source === 'microphone' ? <Mic size={viewMode === 'grid' ? 22 : 18} /> : <FileAudio size={viewMode === 'grid' ? 22 : 18} />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 truncate text-sm group-hover:text-brand-700 transition-colors">
                    {transcript.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setOpenMenu(openMenu === transcript.id ? null : transcript.id)
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatDuration(transcript.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatRelativeTime(transcript.date)}
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    {transcript.speakerCount} speakers
                  </span>
                </div>
                {viewMode === 'grid' && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{transcript.summary}</p>
                )}
                {transcript.tags.length > 0 && viewMode === 'grid' && (
                  <div className="flex gap-1.5 mt-2">
                    {transcript.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-gray-50 text-[10px] font-medium text-gray-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* List view extra info */}
              {viewMode === 'list' && (
                <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                  {transcript.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-gray-50 text-[10px] font-medium text-gray-500">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Context Menu */}
              {openMenu === transcript.id && (
                <div className="absolute right-4 top-12 z-10 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fade-in">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <Pencil size={14} /> Rename
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <Tag size={14} /> Add Tag
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <Share2 size={14} /> Share
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filteredTranscripts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">No transcripts found</h3>
          <p className="text-sm text-gray-500">Try a different search or create a new recording.</p>
        </div>
      )}

      {/* New Recording Bottom Sheet */}
      {showNewSheet && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 animate-fade-in" onClick={() => setShowNewSheet(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl animate-slide-up md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:max-w-md md:w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-display font-bold text-gray-950">New Recording</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Auto Detect</span>
                  <button onClick={() => setShowNewSheet(false)} className="p-1 text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/transcribe" onClick={() => setShowNewSheet(false)}>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-50 hover:bg-brand-100 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 group-hover:bg-brand-200 transition-colors">
                      <Mic size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Start audio recording</p>
                      <p className="text-xs text-gray-500 mt-0.5">Record and transcribe in real-time</p>
                    </div>
                  </div>
                </Link>

                <Link href="/transcribe?mode=upload" onClick={() => setShowNewSheet(false)}>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer group mt-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-200 transition-colors">
                      <Upload size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Upload from files</p>
                      <p className="text-xs text-gray-500 mt-0.5">MP3, WAV, MP4, M4A, and more</p>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-200 transition-colors">
                    <Youtube size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">YouTube Video</p>
                    <p className="text-xs text-gray-500 mt-0.5">Paste a YouTube URL to transcribe</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-200 transition-colors">
                    <Link2 size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Join Meeting</p>
                    <p className="text-xs text-gray-500 mt-0.5">Zoom, Google Meet, or Teams link</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile FAB (redundant with bottom nav, but visible on scroll) */}
      <button
        onClick={() => setShowNewSheet(true)}
        className="sm:hidden fixed right-4 bottom-20 z-30 w-14 h-14 rounded-full gradient-bg text-white shadow-lg shadow-brand-600/30 flex items-center justify-center"
      >
        <Plus size={24} />
      </button>
    </div>
  )
}
