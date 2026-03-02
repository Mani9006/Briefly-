'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import Logo from '@/components/layout/Logo'
import Button from '@/components/ui/Button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSent(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
          <div className="flex justify-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2">
              <Logo size={36} />
              <span className="font-display font-bold text-xl">Briefly</span>
            </Link>
          </div>

          {!isSent ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-display font-bold text-gray-950">Reset password</h1>
                <p className="text-gray-600 mt-2 text-sm">
                  Enter the email associated with your account and we&apos;ll send a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Send Reset Link
                  <ArrowRight size={16} />
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="text-xl font-display font-bold text-gray-950 mb-2">Check your email</h2>
              <p className="text-gray-600 text-sm mb-6">
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-xs text-gray-400">
                Didn&apos;t receive the email?{' '}
                <button
                  onClick={() => { setIsSent(false); setIsLoading(false) }}
                  className="text-brand-600 hover:text-brand-700 font-medium"
                >
                  Try again
                </button>
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft size={14} />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
