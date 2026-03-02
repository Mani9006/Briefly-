'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Share2, MoreHorizontal, Play, Pause, SkipBack, SkipForward,
  Volume2, ListChecks, MessageSquareText, MessageCircle, Clock, Users,
  Copy, Download, FileText, FileDown, Music, Link2, X, Send,
  Sparkles, ChevronDown, Search, Bookmark, BookmarkCheck, Pencil
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn, formatDuration } from '@/lib/utils'

type TabType = 'minutes' | 'transcript' | 'chat'

// Demo data
const demoSpeakers = [
  { id: 's1', name: 'Tianying', color: '#6b8e6b', initial: 'T' },
  { id: 's2', name: 'Daniel', color: '#8b7355', initial: 'D' },
  { id: 's3', name: 'Manny', color: '#5b7bb5', initial: 'M' },
]

const demoTranscript = [
  { id: '1', speakerId: 's1', name: 'Tianying', time: 0, text: 'A so error message saying it\'s too big and. Yeah, but I will double check the function and once it\'s available.' },
  { id: '2', speakerId: 's2', name: 'Daniel', time: 9, text: 'Thank you. Yeah, the tokens will confuse the lawyers.' },
  { id: '3', speakerId: 's1', name: 'Tianying', time: 13, text: 'Yeah, absolutely. Yeah. And also even the our way to calculate the number of character is very different. It\'s calculating the number of character up in the nested dictionary rather than the document itself and its reliable number than the actual number of characters. So we definitely don\'t want to share those information with.' },
  { id: '4', speakerId: 's2', name: 'Daniel', time: 37, text: 'Awesome. Well, thank you. And is there anything else for the refinement or anything else?' },
  { id: '5', speakerId: 's1', name: 'Tianying', time: 44, text: 'I think we can. Yeah, I think this one. Let\'s keep it open for now until I establish a track curve with DD team and it can be kept open for now but after I share the tracker and with the limitation in place. So I think we can close this one and the next day we\'re just increase limit and functionalize to see whether we can do something improve the performance.' },
  { id: '6', speakerId: 's3', name: 'Manny', time: 78, text: 'I have updated data sets for both models sent to Jen and the robot. For the apes, we should wait until the DD evaluations come up and pick one of the good models. DDE evaluation should be done by March 10th when the code freeze would be.' },
  { id: '7', speakerId: 's2', name: 'Daniel', time: 112, text: 'That makes sense. Too many tokens though, can only use one or two. There are thousands of ape toggles, some over a year old.' },
  { id: '8', speakerId: 's3', name: 'Manny', time: 135, text: 'We should reduce the amount of experiments ongoing in production. Run the DDE evaluation before merging into main. If Sonnet is not released, why have a sonic toggle?' },
  { id: '9', speakerId: 's2', name: 'Daniel', time: 162, text: 'Code freeze is March 10th. It makes sense to still keep a backup model, but we definitely don\'t need so many toggles. Let\'s see from the evaluation bounce.' },
  { id: '10', speakerId: 's1', name: 'Tianying', time: 195, text: 'For the evaluation of performance on draft queries - not yet considered, but will take a deeper look. We can pull some from previous pools when doing the intent classification. I\'ll share the data set if needed.' },
]

const demoMinutes = {
  title: 'Token Management',
  date: '3/2/2026, 3:55 AM',
  duration: '6 min, 18 sec',
  sections: [
    {
      heading: null,
      items: [
        'Error message saying it\'s too big.',
        'Double check the function.',
        'Tokens will confuse the lawyers.',
        'The way to calculate the number of characters is different, calculating in the nested dictionary rather than the document itself.',
      ]
    },
    {
      heading: 'Refinement',
      items: [
        'Keep it open for now until a tracker curve with DD team is established.',
        'After sharing the tracker with the limitation in place, it can be closed.',
        'Increase limit and functionalize to see whether performance can be improved.',
      ]
    },
    {
      heading: 'Manny',
      items: [
        'Updated data sets for both models sent to Jen and the robot.',
        'Apes: Wait until the DD evaluations come up.',
        'Pick one of the good models.',
        'DDE evaluation done by March 10th when the code freeze would be.',
        'Too many tokens, can only use one or two.',
        'Reduce the amount of experiments ongoing in production.',
        'Run the DDE evaluation before merging into main.',
      ]
    },
    {
      heading: 'Evaluation of Performance on Draft Queries',
      items: [
        'Not yet considered, but will take a deeper look.',
        'Pull some from previous pools when doing the intent classification.',
        'Share the data set if needed.',
        'See how they perform on prompt strengthening.',
      ]
    },
  ],
  actionItems: [
    'Double check the function for error message (Tianying)',
    'Establish tracker curve with DD team (Tianying)',
    'Complete DDE evaluation by March 10th (Manny)',
    'Reduce experiment toggles in production (Daniel)',
    'Share data set for draft query evaluation (Tianying)',
  ]
}

const chatSuggestions = ['List action items', 'Draft follow-up email', 'Summarize key decisions', 'Who said what about tokens?']

export default function TranscriptPage() {
  const [activeTab, setActiveTab] = useState<TabType>('minutes')
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant', text: string }>>([
    { role: 'assistant', text: `Hi! I'm here to assist you with your note: ${demoMinutes.title}. How can I help?` }
  ])
  const [chatInput, setChatInput] = useState('')
  const [bookmarkedSegments, setBookmarkedSegments] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const getSpeaker = (id: string) => demoSpeakers.find(s => s.id === id)

  const handleSendChat = (text?: string) => {
    const message = text || chatInput
    if (!message.trim()) return

    setChatMessages(prev => [...prev, { role: 'user', text: message }])
    setChatInput('')

    // Simulate AI response
    setTimeout(() => {
      let response = ''
      if (message.toLowerCase().includes('action')) {
        response = `Here are the action items from this meeting:\n\n${demoMinutes.actionItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}`
      } else if (message.toLowerCase().includes('email') || message.toLowerCase().includes('follow')) {
        response = 'Here\'s a draft follow-up email:\n\n**Subject: Token Management Meeting - Action Items & Next Steps**\n\nHi team,\n\nThank you for today\'s discussion. Here are the key outcomes:\n\n- Tianying will verify the error message function and establish a tracker with the DD team\n- DDE evaluation to be completed by March 10th code freeze\n- We\'ll reduce the number of experiment toggles in production\n- Draft query evaluation data sets will be shared for review\n\nPlease reach out if you have questions.\n\nBest regards'
      } else if (message.toLowerCase().includes('summar')) {
        response = 'The meeting covered three main topics: (1) Token management issues where the character calculation method differs from what lawyers expect, (2) Model evaluation progress with DDE evaluations due by March 10th code freeze, and (3) Draft query performance which needs further investigation using previous data pools.'
      } else {
        response = 'Based on the transcript, the discussion primarily focused on token management and model evaluation. Tianying noted that the error message indicates the content is too big, and the character counting method uses nested dictionary counts rather than document-level counts. The team agreed to keep the issue open until a tracker is established with the DD team.'
      }
      setChatMessages(prev => [...prev, { role: 'assistant', text: response }])
    }, 1000)
  }

  const toggleBookmark = (id: string) => {
    setBookmarkedSegments(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filteredTranscript = searchQuery
    ? demoTranscript.filter(s => s.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : demoTranscript

  const tabs: Array<{ id: TabType; icon: React.ElementType; label: string }> = [
    { id: 'minutes', icon: ListChecks, label: 'Minutes' },
    { id: 'transcript', icon: MessageSquareText, label: 'Transcript' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <button className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-display font-bold text-gray-950">{demoMinutes.title}</h1>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <span className="flex items-center gap-1"><Clock size={12} />{demoMinutes.date}</span>
              <span>&middot;</span>
              <span>{demoMinutes.duration}</span>
              <span>&middot;</span>
              <span className="flex items-center gap-1"><Users size={12} />{demoSpeakers.length} speakers</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Minutes Tab */}
        {activeTab === 'minutes' && (
          <div className="p-6 sm:p-8">
            {/* Action Items Banner */}
            {demoMinutes.actionItems.length > 0 && (
              <div className="mb-8 p-5 bg-gradient-to-r from-brand-50 to-accent-50 rounded-xl border border-brand-100">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-brand-600" />
                  <h3 className="text-sm font-semibold text-brand-700">Action Items</h3>
                </div>
                <ul className="space-y-2">
                  {demoMinutes.actionItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Summary Sections */}
            <div className="space-y-6">
              {demoMinutes.sections.map((section, i) => (
                <div key={i}>
                  {section.heading && (
                    <h3 className="text-lg font-bold text-gray-950 mb-3">{section.heading}</h3>
                  )}
                  <ul className="space-y-2">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcript Tab */}
        {activeTab === 'transcript' && (
          <div>
            {/* Transcript Search */}
            <div className="px-6 py-3 border-b border-gray-50 flex items-center justify-between">
              {showSearch ? (
                <div className="flex-1 flex items-center gap-2">
                  <Search size={16} className="text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in transcript..."
                    className="flex-1 text-sm focus:outline-none"
                    autoFocus
                  />
                  <button onClick={() => { setShowSearch(false); setSearchQuery('') }} className="p-1 text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-xs text-gray-500">{demoTranscript.length} segments</span>
                  <button onClick={() => setShowSearch(true)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                    <Search size={16} />
                  </button>
                </>
              )}
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[600px] overflow-y-auto">
              {filteredTranscript.map((segment) => {
                const speaker = getSpeaker(segment.speakerId)
                const isBookmarked = bookmarkedSegments.has(segment.id)
                return (
                  <div key={segment.id} className="group flex gap-4">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: speaker?.color || '#6b7280' }}
                    >
                      {speaker?.initial}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">{segment.name}</span>
                        <span className="text-xs text-gray-400 font-mono">{formatDuration(segment.time)}</span>
                        <button
                          onClick={() => toggleBookmark(segment.id)}
                          className={cn(
                            'ml-auto p-1 rounded transition-all',
                            isBookmarked
                              ? 'text-brand-600'
                              : 'text-gray-300 opacity-0 group-hover:opacity-100 hover:text-gray-500'
                          )}
                        >
                          {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {searchQuery ? (
                          highlightText(segment.text, searchQuery)
                        ) : (
                          segment.text
                        )}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-[600px]">
            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white flex-shrink-0">
                      <Sparkles size={14} />
                    </div>
                  )}
                  <div className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  )}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions */}
            {chatMessages.length <= 2 && (
              <div className="px-6 pb-2">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {chatSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSendChat(suggestion)}
                      className="flex-shrink-0 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-600 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Message..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleSendChat()}
                  disabled={!chatInput.trim()}
                  className="p-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Audio Player */}
      <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-gray-950 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4 max-w-lg w-[calc(100%-2rem)]">
        <button className="p-1 text-gray-400 hover:text-white transition-colors">
          <SkipBack size={16} />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full bg-white text-gray-950 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button className="p-1 text-gray-400 hover:text-white transition-colors">
          <SkipForward size={16} />
        </button>

        <div className="flex-1 mx-2">
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full w-[35%]" />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-500 font-mono">2:12</span>
            <span className="text-[10px] text-gray-500 font-mono">6:18</span>
          </div>
        </div>

        <button className="p-1 text-gray-400 hover:text-white transition-colors">
          <Volume2 size={16} />
        </button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <>
          <div className="fixed inset-0 bg-black/30 z-50 animate-fade-in" onClick={() => setShowShareModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl max-w-md w-[calc(100%-2rem)] animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-display font-bold text-gray-950">Share Minutes</h2>
                <button onClick={() => setShowShareModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              {/* Link Sharing */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Link Sharing</p>
                  <p className="text-xs text-gray-500">Enable or disable link sharing</p>
                </div>
                <button className="w-11 h-6 rounded-full bg-gray-200 relative transition-colors hover:bg-gray-300">
                  <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform" />
                </button>
              </div>
              <div className="px-4 py-3 bg-gray-50 rounded-xl mb-6">
                <p className="text-xs text-gray-400">Link sharing is currently disabled</p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Export / Download</h3>
                <div className="space-y-2">
                  {[
                    { icon: FileDown, label: 'Share Notes as PDF' },
                    { icon: ListChecks, label: 'Share Notes as Text' },
                    { icon: FileText, label: 'Share Transcript as PDF' },
                    { icon: MessageSquareText, label: 'Share Transcript as Text' },
                    { icon: Music, label: 'Share Audio File' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                      <item.icon size={18} className="text-gray-500" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function highlightText(text: string, query: string) {
  if (!query) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 rounded px-0.5">{part}</mark>
    ) : (
      part
    )
  )
}
