'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'

import {
  LayoutDashboard,
  Users,
  FileSearch,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Stethoscope,
  Shield,
  UserCircle,
  PlusCircle,
  BarChart3,
  Upload,
  MessageSquare
} from 'lucide-react'

import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
  role: 'doctor' | 'admin' | 'patient'
}

export function DashboardLayout({
  children,
  role,
}: DashboardLayoutProps) {
  const router = useRouter()

  const {
    currentUser,
    logout,
    isAuthenticated,
  } = useStore()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

 const [hydrated, setHydrated] =
  useState(false)

useEffect(() => {
  setHydrated(true)
}, [])

useEffect(() => {
  if (
    hydrated &&
    !isAuthenticated
  ) {
    router.push('/')
  }
}, [hydrated, isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  /* =========================
     Doctor Navigation
  ========================= */

  const doctorNavItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard/doctor',
    },

    {
      label: 'Patients',
      icon: Users,
      href: '/dashboard/doctor/patients',
    },

    {
      label: 'New Patient',
      icon: PlusCircle,
      href: '/dashboard/doctor/patients/new',
    },

    {
      label: 'Scan Analysis',
      icon: FileSearch,
      href: '/dashboard/doctor/analysis',
    },

    {
      label: 'Reports',
      icon: BarChart3,
      href: '/dashboard/doctor/reports',
    },
{
  label: 'Feedback',
  icon: MessageSquare,
  href: '/dashboard/doctor/feedback',
},
    {
      label: 'Settings',
      icon: Settings,
      href: '/dashboard/doctor/settings',
    },
  ]

  /* =========================
     Admin Navigation
  ========================= */
const adminNavItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard/admin',
  },

  {
    label: 'Doctors',
    icon: Stethoscope,
    href: '/dashboard/admin/doctors',
  },

  {
    label: 'Patients',
    icon: Users,
    href: '/dashboard/admin/patients',
  },

  {
    label: 'Analytics',
    icon: BarChart3,
    href: '/dashboard/admin/analytics',
  },

  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/admin/settings',
  },
]

  /* =========================
     Patient Navigation
  ========================= */

  const patientNavItems = [
    {
      label: 'My Results',
      icon: FileSearch,
      href: '/dashboard/patient',
    },

    {
      label: 'Upload Scan',
      icon: Upload,
      href: '/dashboard/upload-scan',
    },

  {
  label: 'AI Insights',
  icon: BarChart3,
  href: '/dashboard/patient/ai-insights',
},

    {
      label: 'Settings',
      icon: Settings,
      href: '/dashboard/patient/settings',
    },
  ]

  const navItems =
    role === 'doctor'
      ? doctorNavItems
      : role === 'admin'
      ? adminNavItems
      : patientNavItems

  const roleIcon =
    role === 'doctor'
      ? Stethoscope
      : role === 'admin'
      ? Shield
      : UserCircle

  const roleColor =
    role === 'doctor'
      ? 'text-primary'
      : role === 'admin'
      ? 'text-accent'
      : 'text-muted-foreground'

 if (!hydrated) {
  return null
}

if (!isAuthenticated || !currentUser) {
  return null
}

  return (
    <div className="min-h-screen bg-background">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white shadow-2xl transition-transform duration-300 lg:translate-x-0',
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">

          {/* Logo */}
          <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-between">
            <Logo size="sm" />

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-sidebar-foreground hover:text-sidebar-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
               className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Section */}
         <div className="p-4 border-t border-white/10">

            <div className="flex items-center gap-3 mb-4">

              <div
                className={cn(
                  'w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center',
                  roleColor
                )}
              >
                {React.createElement(roleIcon, {
                  className: 'h-5 w-5',
                })}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {currentUser.name}
                </p>

                <p className="text-xs text-sidebar-foreground/60 capitalize">
                  {role}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>

          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">

        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur border-b border-border">

          <div className="flex items-center justify-between h-full px-4 lg:px-6">

            <div className="flex items-center gap-4">

              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-foreground hover:text-primary"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Search */}
              <div className="hidden sm:flex items-center relative">

                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />

                <input
                  type="text"
                  placeholder="Search patients, scans..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-64 pl-10 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
              >
                <Bell className="h-5 w-5" />

                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User */}
              <Button
                variant="ghost"
                className="hidden sm:flex items-center gap-2"
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full bg-muted flex items-center justify-center',
                    roleColor
                  )}
                >
                  {React.createElement(roleIcon, {
                    className: 'h-4 w-4',
                  })}
                </div>

                <span className="text-sm font-medium">
                  {currentUser.name}
                </span>

                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>

            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>

      </div>
    </div>
  )
}
