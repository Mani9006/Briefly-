'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Mic, Upload, Users, Brain, ArrowRight, Check,
  Sparkles, ChevronRight
} from 'lucide-react'
import Logo from '@/components/layout/Logo'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const steps = [
  {
    id: 1,
    title: 'Welcome to Briefly',
    subtitle: 'How do you plan to use Briefly?',
    options: [
      { icon: Users, label: 'Team meetings', description: 'Record and summarize team standups, all-hands, and syncs' },
      { icon: Mic, label: 'Interviews', description: 'Capture interviews, user research sessions, and feedback' },
      { icon: Brain, label: 'Lectures & classes', description: 'Transcribe lectures, webinars, and educational content' },
      { icon: Upload, label: 'Transcribe files', description: 'Upload audio/video files and get instant transcripts' },
    ],
  },
  {
    id: 2,
    title: 'Your workspace',
    subtitle: 'Set up your workspace to get started',
    fields: [
      { label: 'Workspace name', placeholder: 'e.g. My Team', type: 'text' },
      { label: 'Primary language', placeholder: 'English (US)', type: 'select' },
    ],
  },
  {
    id: 3,
    title: 'You\'re all set!',
    subtitle: 'Start capturing conversations with AI-powered precision',
    features: [
      'Real-time transcription with speaker identification',
      'AI summaries and action items after every meeting',
      'Search across all your transcripts instantly',
      'Export as PDF, TXT, or share via link',
    ],
  },
]

export default function WelcomePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null)
  const [workspaceName, setWorkspaceName] = useState('')

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      window.location.href = '/dashboard'
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const canProceed = currentStep === 0 ? !!selectedUseCase :
    currentStep === 1 ? workspaceName.length > 0 :
    true

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === currentStep ? 'w-8 bg-brand-600' :
                i < currentStep ? 'w-8 bg-brand-300' : 'w-8 bg-gray-200'
              )}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo size={48} />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-gray-950">{step.title}</h1>
            <p className="text-gray-600 mt-2">{step.subtitle}</p>
          </div>

          {/* Step 1: Use case selection */}
          {currentStep === 0 && step.options && (
            <div className="space-y-3">
              {step.options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedUseCase(option.label)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all',
                    selectedUseCase === option.label
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    selectedUseCase === option.label ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-500'
                  )}>
                    <option.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{option.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                  </div>
                  {selectedUseCase === option.label && (
                    <Check size={18} className="text-brand-600" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Workspace setup */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Workspace name
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="e.g. My Team"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Primary language
                </label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Japanese</option>
                  <option>Chinese (Simplified)</option>
                  <option>Hindi</option>
                  <option>Portuguese</option>
                  <option>Arabic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Invite teammates (optional)
                </label>
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">You can always invite more people later.</p>
              </div>
            </div>
          )}

          {/* Step 3: All set */}
          {currentStep === 2 && step.features && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-brand-50 to-accent-50 rounded-xl p-6 border border-brand-100">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={18} className="text-brand-600" />
                  <span className="text-sm font-semibold text-brand-700">What you can do</span>
                </div>
                <ul className="space-y-3">
                  {step.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                      <Check size={16} className="text-brand-600 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center text-xs text-gray-400">
                <p>300 free minutes every month. No credit card required.</p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-8">
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="w-full"
              size="lg"
            >
              {isLastStep ? (
                <>
                  Go to Dashboard
                  <ArrowRight size={18} />
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight size={18} />
                </>
              )}
            </Button>
          </div>

          {/* Skip */}
          {!isLastStep && (
            <button
              onClick={() => setCurrentStep(steps.length - 1)}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3 transition-colors"
            >
              Skip setup
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
