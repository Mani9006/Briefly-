'use client'

import Link from 'next/link'
import Logo from '@/components/layout/Logo'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size={48} />
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-950 mb-3">Something went wrong</h1>
        <p className="text-gray-600 mb-8 text-sm">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/25"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-5 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:border-brand-500 hover:text-brand-600 transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
