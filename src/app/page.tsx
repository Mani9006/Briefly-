'use client'

import Link from 'next/link'
import {
  Mic, FileAudio, Brain, Users, Search, Download,
  Zap, Shield, Globe, Clock, ChevronRight, Check,
  Play, ArrowRight, Sparkles, MessageSquare
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles size={16} />
            AI-Powered Transcription & Meeting Intelligence
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-950 mb-6 animate-slide-up">
            Every conversation,
            <br />
            <span className="gradient-text">captured briefly.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Transform meetings, interviews, and lectures into searchable transcripts
            with AI summaries, action items, and speaker identification &mdash; all in real time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/auth/signup">
              <Button size="lg" className="group">
                Start Transcribing Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg">
                <Play size={18} />
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Hero Mockup */}
          <div className="max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-lg bg-white text-xs text-gray-400 border border-gray-200">
                    <Shield size={12} />
                    app.briefly.ai
                  </div>
                </div>
              </div>
              {/* App mockup content */}
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-6">
                  {/* Left - Transcript */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-sm font-medium text-red-600">Recording &mdash; 24:15</span>
                    </div>
                    {[
                      { name: 'Sarah Chen', color: 'bg-blue-500', text: 'I think we should focus on the user onboarding flow first. The current drop-off rate is around 40%.' },
                      { name: 'Mike Ross', color: 'bg-green-500', text: 'Agreed. I\'ve been analyzing the data and most users leave during step 3 of the signup process.' },
                      { name: 'Sarah Chen', color: 'bg-blue-500', text: 'Let\'s schedule a design review for Thursday. Can you prepare the wireframes by then?' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {item.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600 mt-0.5">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Right - AI Summary */}
                  <div className="hidden sm:block w-64 p-4 bg-brand-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain size={16} className="text-brand-600" />
                      <span className="text-xs font-semibold text-brand-700">AI Summary</span>
                    </div>
                    <ul className="space-y-2 text-xs text-gray-700">
                      <li className="flex gap-2">
                        <Check size={14} className="text-brand-600 flex-shrink-0 mt-0.5" />
                        Focus on user onboarding improvement
                      </li>
                      <li className="flex gap-2">
                        <Check size={14} className="text-brand-600 flex-shrink-0 mt-0.5" />
                        40% drop-off rate at signup step 3
                      </li>
                      <li className="flex gap-2">
                        <Check size={14} className="text-brand-600 flex-shrink-0 mt-0.5" />
                        Design review scheduled for Thursday
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Social Proof */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 mb-8">Trusted by teams at leading companies</p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-40">
            {['Google', 'Microsoft', 'Slack', 'Zoom', 'Notion'].map((name) => (
              <span key={name} className="text-xl font-bold text-gray-900">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-950 mb-4">
              Everything you need to capture conversations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful AI features that turn hours of audio into organized, searchable, actionable notes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Mic,
                title: 'Real-Time Transcription',
                description: 'Live transcription with 95%+ accuracy as you speak. Works with meetings, lectures, interviews, and more.',
                color: 'bg-blue-50 text-blue-600',
              },
              {
                icon: Brain,
                title: 'AI Summaries',
                description: 'Automatic meeting summaries, key takeaways, and action items generated by advanced AI models.',
                color: 'bg-purple-50 text-purple-600',
              },
              {
                icon: Users,
                title: 'Speaker Identification',
                description: 'Automatically detect and label different speakers in the conversation with voice fingerprinting.',
                color: 'bg-green-50 text-green-600',
              },
              {
                icon: FileAudio,
                title: 'Audio & Video Upload',
                description: 'Upload recordings in any format - MP3, WAV, MP4, M4A, and more. Get transcripts in minutes.',
                color: 'bg-orange-50 text-orange-600',
              },
              {
                icon: Search,
                title: 'Smart Search',
                description: 'Search across all your transcripts instantly. Find any moment, quote, or topic in seconds.',
                color: 'bg-pink-50 text-pink-600',
              },
              {
                icon: Download,
                title: 'Export Anywhere',
                description: 'Export transcripts as TXT, PDF, SRT, or DOCX. Share with teammates or import into other tools.',
                color: 'bg-teal-50 text-teal-600',
              },
              {
                icon: Globe,
                title: 'Multi-Language Support',
                description: 'Transcribe in 30+ languages with automatic language detection. Cross-language search included.',
                color: 'bg-indigo-50 text-indigo-600',
              },
              {
                icon: MessageSquare,
                title: 'Chat with Transcripts',
                description: 'Ask questions about your meetings. AI reads the full context and gives you instant answers.',
                color: 'bg-amber-50 text-amber-600',
              },
              {
                icon: Zap,
                title: 'Integrations',
                description: 'Connect with Zoom, Google Meet, Microsoft Teams, Slack, Notion, and 20+ other tools.',
                color: 'bg-red-50 text-red-600',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-4`}>
                  <feature.icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-950 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-950 mb-4">
              How Briefly works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in seconds. No complex setup required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Record or Upload',
                description: 'Start a live recording or upload an audio/video file. Briefly supports all major formats and integrates with Zoom, Meet, and Teams.',
                icon: Mic,
              },
              {
                step: '02',
                title: 'AI Transcribes & Analyzes',
                description: 'Our AI engine transcribes audio in real-time, identifies speakers, and generates summaries with key points and action items.',
                icon: Brain,
              },
              {
                step: '03',
                title: 'Review & Share',
                description: 'Search, edit, and organize your transcripts. Export in any format or share directly with your team via a link.',
                icon: Download,
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
                  <span className="font-display text-5xl font-extrabold text-gray-100">{item.step}</span>
                  <div className="mt-4">
                    <div className="inline-flex p-3 rounded-xl bg-brand-50 text-brand-600 mb-4">
                      <item.icon size={22} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-950 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 gradient-bg text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10M+', label: 'Hours Transcribed' },
              { value: '95%', label: 'Accuracy Rate' },
              { value: '30+', label: 'Languages Supported' },
              { value: '50K+', label: 'Active Users' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-display font-extrabold mb-2">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-950 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                description: 'Perfect for getting started',
                features: [
                  '300 minutes/month',
                  'Real-time transcription',
                  'AI summaries',
                  'Export as TXT',
                  '3 languages',
                ],
                cta: 'Get Started',
                popular: false,
              },
              {
                name: 'Pro',
                price: '$12',
                period: '/month',
                description: 'For professionals and teams',
                features: [
                  'Unlimited minutes',
                  'Everything in Free',
                  'Speaker identification',
                  'Smart search across all transcripts',
                  'Export as PDF, DOCX, SRT',
                  '30+ languages',
                  'Chat with transcripts',
                  'Priority support',
                ],
                cta: 'Start Pro Trial',
                popular: true,
              },
              {
                name: 'Business',
                price: '$29',
                period: '/user/month',
                description: 'For organizations',
                features: [
                  'Everything in Pro',
                  'Team workspaces',
                  'Admin dashboard',
                  'SSO & SAML',
                  'API access',
                  'Custom integrations',
                  'Dedicated support',
                  'SLA guarantee',
                ],
                cta: 'Contact Sales',
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gray-950 text-white ring-4 ring-brand-500/20 scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <span className="inline-flex px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-medium mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className={`text-xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-gray-950'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-display font-extrabold ${plan.popular ? 'text-white' : 'text-gray-950'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                </div>
                <Link href="/auth/signup">
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full mb-6"
                  >
                    {plan.cta}
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check size={16} className={`flex-shrink-0 mt-0.5 ${plan.popular ? 'text-brand-400' : 'text-brand-600'}`} />
                      <span className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-950 mb-4">
            Ready to capture every word?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of professionals who use Briefly to turn conversations into action.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="group">
              Get Started Free
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">No credit card required. 300 free minutes/month.</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
