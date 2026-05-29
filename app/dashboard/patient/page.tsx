'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStore, Patient } from '@/lib/store'
import { Logo } from '@/components/logo'
import { 
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  HelpCircle,
  Shield,
  Activity,
  Calendar,
  FileImage,
  User,
  Phone,
  Mail,
  Download,
  MessageCircle,
  Heart,
  Stethoscope,
  ArrowRight,
  Info
} from 'lucide-react'
import Link from 'next/link'

export default function PatientPortalPage() {
  const router = useRouter()
  const { currentUser, guestPatientId, patients, isAuthenticated } = useStore()

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== 'guest' || !guestPatientId) {
      router.push('/auth/guest')
    }
  }, [isAuthenticated, currentUser, guestPatientId, router])

  const patient = patients.find(p => p.id === guestPatientId)

  if (!patient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Record Not Found</h2>
            <p className="text-muted-foreground mb-4">
              We {"couldn't"} find your patient record. Please contact your healthcare provider.
            </p>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusIcon = (status: Patient['status']) => {
    switch (status) {
      case 'positive':
        return <AlertTriangle className="h-6 w-6 text-destructive" />
      case 'negative':
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-600" />
      case 'inconclusive':
        return <HelpCircle className="h-6 w-6 text-muted-foreground" />
    }
  }

  const getStatusTitle = (status: Patient['status']) => {
    switch (status) {
      case 'positive':
        return 'Positive Result Detected'
      case 'negative':
        return 'No Concerns Detected'
      case 'pending':
        return 'Analysis in Progress'
      case 'inconclusive':
        return 'Additional Review Needed'
    }
  }

  const getStatusDescription = (status: Patient['status']) => {
    switch (status) {
      case 'positive':
        return 'Our AI analysis has detected findings that require further medical attention. Please contact your healthcare provider to discuss next steps.'
      case 'negative':
        return 'Great news! Our AI analysis did not detect any concerning findings in your scan. Continue with regular screening as recommended.'
      case 'pending':
        return 'Your scan is currently being analyzed by our AI system. Results will be available shortly. Please check back soon.'
      case 'inconclusive':
        return 'The analysis results are inconclusive. Additional imaging or evaluation may be recommended. Please discuss with your doctor.'
    }
  }

  const getStatusCardStyles = (status: Patient['status']) => {
    switch (status) {
      case 'positive':
        return 'bg-destructive/5 border-destructive/30'
      case 'negative':
        return 'bg-green-50 border-green-200'
      case 'pending':
        return 'bg-yellow-50 border-yellow-200'
      case 'inconclusive':
        return 'bg-muted border-border'
    }
  }

  const getRiskBadgeStyles = (risk?: 'low' | 'moderate' | 'high') => {
    switch (risk) {
      case 'high':
        return 'bg-destructive text-destructive-foreground'
      case 'moderate':
        return 'bg-yellow-500 text-white'
      case 'low':
        return 'bg-green-600 text-white'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <DashboardLayout role="patient">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="text-center py-6">
          <Logo size="md" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold mb-2">Welcome, {patient.name}</h1>
          <p className="text-muted-foreground">
            View your scan results and AI analysis below
          </p>
        </div>

        {/* Status Card */}
        <Card className={`border-2 ${getStatusCardStyles(patient.status)}`}>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                patient.status === 'positive' ? 'bg-destructive/10' :
                patient.status === 'negative' ? 'bg-green-100' :
                patient.status === 'pending' ? 'bg-yellow-100' : 'bg-muted'
              }`}>
                {getStatusIcon(patient.status)}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold mb-1">{getStatusTitle(patient.status)}</h2>
                <p className="text-muted-foreground">{getStatusDescription(patient.status)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scan Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{patient.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age</span>
                <span className="font-medium">{patient.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Patient ID</span>
                <span className="font-mono text-sm">{patient.id}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5 text-primary" />
                Scan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scan Type</span>
                <span className="font-medium">{patient.scanType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scan Date</span>
                <span className="font-medium">{patient.scanDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reason</span>
                <span className="font-medium">{patient.disease}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis Results */}
        {patient.aiAnalysis && (
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                AI Analysis Results
              </CardTitle>
              <CardDescription>
                Automated analysis by OncoScanXai AI System
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Confidence & Risk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">AI Confidence Level</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${patient.aiAnalysis.confidence}%` }}
                      />
                    </div>
                    <span className="text-xl font-bold">{patient.aiAnalysis.confidence}%</span>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Risk Assessment</p>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getRiskBadgeStyles(patient.aiAnalysis.riskLevel)}`}>
                    <Shield className="h-4 w-4" />
                    {patient.aiAnalysis.riskLevel?.toUpperCase()} RISK
                  </span>
                </div>
              </div>

              {/* Findings */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Analysis Findings
                </h4>
                <ul className="space-y-2">
                  {patient.aiAnalysis.findings.map((finding, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendation */}
              <div className={`p-4 rounded-lg border-2 ${
                patient.status === 'positive' 
                  ? 'bg-destructive/5 border-destructive/30' 
                  : patient.status === 'negative'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
              }`}>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Doctor&apos;s Recommendation
                </h4>
                <p className="text-sm leading-relaxed">{patient.aiAnalysis.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Analysis Message */}
        {!patient.aiAnalysis && patient.status === 'pending' && (
          <Card className="border-2 border-yellow-200 bg-yellow-50/50">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Brain className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Analysis in Progress</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your scan is currently being analyzed by our AI system. Please check back in a few minutes for your results.
              </p>
            </CardContent>
          </Card>
        )}

        {/* What to Do Next */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-primary" />
              What to Do Next
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patient.status === 'positive' && (
                <>
                  <div className="flex items-start gap-3 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Immediate Action Required</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Please contact your healthcare provider as soon as possible to discuss your results and schedule a follow-up appointment.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Schedule an appointment with your doctor within the next 48 hours
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Bring a copy of this report to your appointment
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Prepare a list of questions for your doctor
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Consider bringing a family member or friend for support
                    </li>
                  </ul>
                </>
              )}

              {patient.status === 'negative' && (
                <>
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-700">Continue Regular Screenings</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your results show no concerning findings. Continue with your regular health screenings as recommended by your doctor.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      Schedule your next screening in 12 months
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      Maintain a healthy lifestyle
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      Perform regular self-examinations
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      Report any changes to your doctor immediately
                    </li>
                  </ul>
                </>
              )}

              {patient.status === 'inconclusive' && (
                <>
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Info className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-700">Follow-up Recommended</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Additional testing may be needed for a clearer result. Please contact your healthcare provider.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                      Schedule a follow-up appointment within 2 weeks
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                      Discuss additional imaging options with your doctor
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                      {"Don't"} worry - inconclusive results are common and usually resolve with additional testing
                    </li>
                  </ul>
                </>
              )}

              {patient.status === 'pending' && (
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                    Check back in a few minutes for your results
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                    You will receive a notification when results are ready
                  </li>
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-medium">Call Us</p>
                <p className="text-sm text-muted-foreground">1-800-ONCOSCAN</p>
              </div>
              <div className="p-4">
                <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">support@oncoscanxai.com</p>
              </div>
              <div className="p-4">
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-medium">Live Chat</p>
                <p className="text-sm text-muted-foreground">Available 24/7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
