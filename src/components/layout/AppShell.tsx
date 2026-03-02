'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Mic, FolderOpen, Search, Settings,
  ChevronLeft, ChevronRight, Plus, LogOut, Crown, User
} from 'lucide-react'
import Logo from './Logo'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/transcribe', icon: Mic, label: 'New Recording' },
  { href: '/dashboard?view=library', icon: FolderOpen, label: 'Library' },
  { href: '/dashboard?view=search', icon: Search, label: 'Search' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-white border-r border-gray-100 transition-all duration-300 sticky top-0 h-screen',
          collapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center h-16 px-4 border-b border-gray-50', collapsed ? 'justify-center' : 'gap-3')}>
          <Logo size={32} />
          {!collapsed && <span className="font-display font-bold text-lg">Briefly</span>}
        </div>

        {/* New Recording Button */}
        <div className="p-3">
          <Link href="/transcribe">
            <button className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/25',
              collapsed && 'justify-center px-0'
            )}>
              <Plus size={18} />
              {!collapsed && 'New Recording'}
            </button>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href.split('?')[0]))
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  collapsed && 'justify-center px-0'
                )}>
                  <item.icon size={20} />
                  {!collapsed && item.label}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Upgrade Banner */}
        {!collapsed && (
          <div className="mx-3 mb-3 p-4 rounded-xl bg-gradient-to-br from-brand-50 to-accent-50 border border-brand-100">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={16} className="text-brand-600" />
              <span className="text-xs font-semibold text-brand-700">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">Unlimited transcriptions, AI chat, and more.</p>
            <button className="w-full px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-medium hover:bg-brand-700 transition-colors">
              Upgrade Now
            </button>
          </div>
        )}

        {/* User / Collapse */}
        <div className="border-t border-gray-100 p-3">
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                <User size={16} className="text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                <p className="text-xs text-gray-500 truncate">Free Plan</p>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <LogOut size={16} />
              </button>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 text-sm transition-all',
              collapsed && 'justify-center px-0'
            )}
          >
            {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /> Collapse</>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-2 pb-safe">
        <div className="flex items-center justify-around h-16">
          {navItems.slice(0, 3).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1',
                  isActive ? 'text-brand-600' : 'text-gray-400'
                )}>
                  <item.icon size={22} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </div>
              </Link>
            )
          })}
          {/* Center FAB for new recording */}
          <Link href="/transcribe" className="-mt-8">
            <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center shadow-lg shadow-brand-600/30">
              <Plus size={24} className="text-white" />
            </div>
          </Link>
          {navItems.slice(3).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1',
                  isActive ? 'text-brand-600' : 'text-gray-400'
                )}>
                  <item.icon size={22} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  )
}
