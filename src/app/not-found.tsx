import Link from 'next/link'
import Logo from '@/components/layout/Logo'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size={64} />
        </div>
        <h1 className="font-display text-7xl font-extrabold text-gray-200 mb-2">404</h1>
        <h2 className="font-display text-2xl font-bold text-gray-950 mb-3">Page not found</h2>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/25"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-5 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:border-brand-500 hover:text-brand-600 transition-all"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
