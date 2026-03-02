'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Globe, Languages, MessageSquare, Mail, Star, Share2,
  RotateCcw, Shield, FileText, User, CreditCard, LogOut, Trash2,
  ChevronRight, Crown, Bell, Moon, Volume2, AlertTriangle, Check
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface SettingItem {
  icon: React.ElementType
  iconColor: string
  iconBg: string
  label: string
  value?: string
  hasChevron?: boolean
  onClick?: () => void
}

interface SettingSection {
  title: string
  items: SettingItem[]
}

export default function SettingsPage() {
  const [transcriptLang, setTranscriptLang] = useState('Auto Detect')
  const [notesLang, setNotesLang] = useState('Auto Detect')
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)

  const sections: SettingSection[] = [
    {
      title: 'Notes',
      items: [
        {
          icon: Languages,
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-100',
          label: 'Transcript Language',
          value: transcriptLang,
          hasChevron: true,
        },
        {
          icon: Globe,
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-100',
          label: 'Notes Language',
          value: notesLang,
          hasChevron: true,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          iconColor: 'text-purple-600',
          iconBg: 'bg-purple-100',
          label: 'Notifications',
          value: notifications ? 'On' : 'Off',
          hasChevron: true,
        },
        {
          icon: Moon,
          iconColor: 'text-indigo-600',
          iconBg: 'bg-indigo-100',
          label: 'Dark Mode',
          value: darkMode ? 'On' : 'Off',
          hasChevron: true,
        },
        {
          icon: Volume2,
          iconColor: 'text-cyan-600',
          iconBg: 'bg-cyan-100',
          label: 'Audio Quality',
          value: 'High',
          hasChevron: true,
        },
        {
          icon: Check,
          iconColor: 'text-green-600',
          iconBg: 'bg-green-100',
          label: 'Auto-save Transcripts',
          value: autoSave ? 'On' : 'Off',
          hasChevron: true,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: MessageSquare,
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-100',
          label: 'Give feedback',
          hasChevron: true,
        },
        {
          icon: Mail,
          iconColor: 'text-orange-600',
          iconBg: 'bg-orange-100',
          label: 'Contact us',
          hasChevron: true,
        },
        {
          icon: Star,
          iconColor: 'text-yellow-600',
          iconBg: 'bg-yellow-100',
          label: 'Leave a review',
          hasChevron: true,
        },
        {
          icon: Share2,
          iconColor: 'text-teal-600',
          iconBg: 'bg-teal-100',
          label: 'Share the app',
          hasChevron: true,
        },
      ],
    },
    {
      title: 'Recovery',
      items: [
        {
          icon: RotateCcw,
          iconColor: 'text-pink-600',
          iconBg: 'bg-pink-100',
          label: 'Recover lost recordings',
          hasChevron: true,
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          icon: Shield,
          iconColor: 'text-red-600',
          iconBg: 'bg-red-100',
          label: 'Privacy policy',
          hasChevron: true,
        },
        {
          icon: FileText,
          iconColor: 'text-green-600',
          iconBg: 'bg-green-100',
          label: 'Terms of service',
          hasChevron: true,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: User,
          iconColor: 'text-gray-600',
          iconBg: 'bg-gray-100',
          label: 'Email: john.doe@example.com',
        },
        {
          icon: CreditCard,
          iconColor: 'text-gray-600',
          iconBg: 'bg-gray-100',
          label: 'Manage subscription',
          hasChevron: true,
        },
        {
          icon: LogOut,
          iconColor: 'text-gray-600',
          iconBg: 'bg-gray-100',
          label: 'Sign out',
          hasChevron: true,
        },
      ],
    },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard">
          <button className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            <ArrowLeft size={18} />
          </button>
        </Link>
        <h1 className="text-2xl font-display font-bold text-gray-950">Settings</h1>
      </div>

      {/* Subscription Banner */}
      <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown size={18} />
              <span className="font-semibold">Free Plan</span>
            </div>
            <p className="text-sm text-white/80">245 of 300 minutes used this month</p>
          </div>
          <Button variant="secondary" size="sm" className="bg-white text-brand-700 hover:bg-gray-100">
            Upgrade to Pro
          </Button>
        </div>
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: '82%' }} />
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
              {section.title}
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {section.items.map((item, i) => (
                <button
                  key={item.label}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors',
                    i < section.items.length - 1 && 'border-b border-gray-50'
                  )}
                >
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', item.iconBg)}>
                    <item.icon size={18} className={item.iconColor} />
                  </div>
                  <span className="flex-1 text-sm font-medium text-gray-900">{item.label}</span>
                  {item.value && (
                    <span className="text-sm text-gray-400">{item.value}</span>
                  )}
                  {item.hasChevron && (
                    <ChevronRight size={16} className="text-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-500" />
            Danger Zone
          </h2>
          <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
            <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-red-50 transition-colors">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-100">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <span className="flex-1 text-sm font-medium text-red-600">Delete account</span>
              <ChevronRight size={16} className="text-red-300" />
            </button>
          </div>
        </div>
      </div>

      {/* App Version */}
      <div className="text-center mt-8 text-xs text-gray-400">
        <p>Briefly v1.0.0</p>
        <p className="mt-1">Made with AI-powered precision</p>
      </div>
    </div>
  )
}
