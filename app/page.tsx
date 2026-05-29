'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  HelpCircle,
  Brain,
  Activity,
  FileSearch,
  Upload,
  ScanSearch,
  ChevronDown,
} from 'lucide-react'

export default function WelcomePage() {
  const [showHelp, setShowHelp] = useState(false)
  const currentYear = new Date().getFullYear()

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description:
        'Advanced machine learning algorithms for accurate breast cancer detection and diagnostic assistance.',
    },
    {
      icon: Activity,
      title: 'Real-time Results',
      description:
        'Instant scan analysis with fast AI-powered predictions for medical professionals.',
    },
    {
      icon: FileSearch,
      title: 'Comprehensive Reports',
      description:
        'Detailed AI-generated findings and clinical recommendations.',
    },
  ]

  return (
    <div className="min-h-screen bg-background gradient-mesh">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-xl border-b border-white/10 bg-background/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo size="lg" />

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl px-5">
                    Login
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52 rounded-xl">
                  <DropdownMenuItem asChild>
                    <Link href="/auth/doctor/login">Doctor Login</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/auth/admin/login">Admin Login</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelp(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* HELP MODAL */}
      {showHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowHelp(false)}
        >
          <Card
            className="max-w-md mx-4 rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle>Help Center</CardTitle>
              <CardDescription>
                Assistance for OncoScanXAI users
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <h4 className="font-semibold">Doctors</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Register with your professional details, verify your email and
                  mobile number, and wait for admin approval.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Administrators</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage doctor approvals, system analytics, and platform
                  settings.
                </p>
              </div>

              <Button
                className="w-full rounded-xl"
                onClick={() => setShowHelp(false)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MAIN */}
      <main className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="text-center py-12 lg:py-20">
            <div className="flex justify-center mb-8">
              <Logo size="elg" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-8">
              Advanced AI-Powered
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Breast Cancer
              </span>{' '}
              Analysis
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-9 mb-14">
              Empowering healthcare professionals with intelligent AI-driven
              diagnostics for early detection and accurate breast cancer
              assessment.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="p-8 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20 rounded-[32px] bg-white/70 backdrop-blur-xl shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-10 w-10 text-primary" />
                  </div>

                  <CardTitle className="text-2xl">Upload Scan</CardTitle>

                  <CardDescription className="text-base">
                    Upload breast scan images for AI-powered analysis and
                    diagnostic prediction.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Link href="/patient_uploadscan">
                    <Button className="w-full rounded-xl h-12 text-base">
                      <Upload className="mr-2 h-5 w-5" />
                      Upload Scan
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="p-8 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20 rounded-[32px] bg-white/70 backdrop-blur-xl shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <ScanSearch className="h-10 w-10 text-primary" />
                  </div>

                  <CardTitle className="text-2xl">Patient Results</CardTitle>

                  <CardDescription className="text-base">
                    View AI-generated scan results and breast cancer analysis
                    reports.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Link href="/auth/guest">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl h-12 text-base"
                    >
                      View Results
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <Card
                    key={feature.title}
                    className="rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-lg"
                  >
                    <CardHeader>
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>

                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative border-t border-teal-500/20 bg-zinc-950 text-zinc-300 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-teal-500/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center">
                <Logo size="sm" />
              </div>

              <p className="text-sm leading-relaxed text-zinc-400 max-w-xs">
                Empowering healthcare professionals with AI-driven insights for
                faster, more accurate breast cancer diagnostic assistance.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6">
                Resources
              </h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/support">Help & Support</Link>
                </li>
                <li>
                  <Link href="/faq">Frequently Asked Questions</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6">
                Legal
              </h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/cookies">Cookie Settings</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6">
                The Team
              </h3>
              <div className="space-y-4">
                <p>Sayan Bag</p>
                <p>Santanu Pratihar</p>
                <p>Krishnendu Ghosh</p>

                <a
                  href="mailto:support@krishnendughosh.in"
                  className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-teal-400"
                >
                  support@krishnendughosh.in
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-xs text-zinc-500">
              © {currentYear} OncoScanXAI. Precision in every pixel.
            </p>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                System Operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
