
'use client'
import jsPDF from 'jspdf'
import { useEffect, useState } from 'react'

import { DashboardLayout } from '@/components/dashboard-layout'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { use } from 'react'

import type { Patient } from '@/lib/store'

import {
  ArrowLeft,
  User,
  FileImage,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  HelpCircle,
  Download,
  Share2,
  Printer,
  TrendingUp,
  Shield,
  Activity
} from 'lucide-react'

import Link from 'next/link'

import {
  doc,
  getDoc
} from 'firebase/firestore'

import { db } from '@/lib/firebase'


export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
const { id } = use(params)

  const [patient, setPatient] = useState<any>(null)

  const [loading, setLoading] = useState(true)
const handleExportPDF = () => {
  if (!patient) return

  try {
    const pdf = new jsPDF('p', 'mm', 'a4')

    let y = 20

    // TITLE
    pdf.setFontSize(22)
    pdf.text('Patient Report', 20, y)

    y += 15

    // PATIENT INFO
    pdf.setFontSize(16)
    pdf.text('Patient Information', 20, y)

    y += 10

    pdf.setFontSize(12)

    pdf.text(`Name: ${patient.name}`, 20, y)
    y += 8

    pdf.text(`Age: ${patient.age}`, 20, y)
    y += 8

    pdf.text(`Gender: ${patient.gender}`, 20, y)
    y += 8

    pdf.text(`Condition: ${patient.disease}`, 20, y)
    y += 8

    pdf.text(`Notes: ${patient.notes || 'N/A'}`, 20, y)
    y += 8

    pdf.text(`Patient ID: ${patient.patientUniqueId}`, 20, y)

    y += 15

    // SCAN DETAILS
    pdf.setFontSize(16)
    pdf.text('Scan Details', 20, y)

    y += 10

    pdf.setFontSize(12)

    pdf.text(`Scan Type: ${patient.scanType}`, 20, y)

    y += 8

    pdf.text(`Status: ${patient.status}`, 20, y)

    y += 8

   pdf.text(
  `Created At: ${
    patient.createdAt?.seconds
      ? new Date(
          patient.createdAt.seconds * 1000
        ).toLocaleString()
      : 'N/A'
  }`,
  20,
  y
)

    y += 15

    // AI ANALYSIS
    if (patient.aiAnalysis) {
      pdf.setFontSize(16)

      pdf.text('AI Analysis', 20, y)

      y += 10

      pdf.setFontSize(12)

      pdf.text(
        `Confidence: ${patient.aiAnalysis.confidence}%`,
        20,
        y
      )

      y += 8

      pdf.text(
        `Risk Level: ${patient.aiAnalysis.riskLevel}`,
        20,
        y
      )

      y += 10

      pdf.text('Findings:', 20, y)

      y += 8

      patient.aiAnalysis.findings?.forEach(
        (finding: string, index: number) => {
          pdf.text(
            `${index + 1}. ${finding}`,
            25,
            y
          )

          y += 8
        }
      )

      y += 5

      pdf.text(
        `Recommendation: ${patient.aiAnalysis.recommendation}`,
        20,
        y
      )
    }

    pdf.save(`${patient.name}-report.pdf`)
  } catch (error) {
    console.error(error)
    alert('Failed to generate PDF')
  }
}
const handlePrint = () => {
  window.print()
}

const handleShare = async () => {
  const shareData = {
    title: 'Patient Report',
    text: `Patient Report for ${patient.name}`,
    url: window.location.href,
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(
        window.location.href
      )

      alert('Link copied to clipboard')
    }
  } catch (error) {
    console.log(error)
  }
}
  // =========================
  // FETCH PATIENT
  // =========================

  useEffect(() => {

    const fetchPatient = async () => {

      try {

        const patientRef = doc(
          db,
          'patients',
          id
        )

        const patientSnap = await getDoc(
          patientRef
        )

        if (patientSnap.exists()) {

          setPatient({
            id: patientSnap.id,
            ...patientSnap.data()
          })

        }

      } catch (error) {

        console.error(error)

      } finally {

        setLoading(false)

      }
    }

    fetchPatient()

  }, [id])

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <DashboardLayout role="doctor">

        <div className="p-10 text-center">

          Loading patient...

        </div>

      </DashboardLayout>
    )
  }

  // =========================
  // NOT FOUND
  // =========================

  if (!patient) {

    return (

      <DashboardLayout role="doctor">

        <div className="text-center py-12">

          <h2 className="text-xl font-semibold mb-2">
            Patient not found
          </h2>

          <p className="text-muted-foreground mb-4">
            The requested patient record does not exist.
          </p>

          <Link href="/dashboard/doctor/patients">

            <Button>
              Back to Patients
            </Button>

          </Link>

        </div>

      </DashboardLayout>
    )
  }

  // =========================
  // STATUS ICON
  // =========================

  const getStatusIcon = (status: Patient['status']) => {

    switch (status) {

      case 'positive':
        return (
          <AlertTriangle className="h-5 w-5 text-destructive" />
        )

      case 'negative':
        return (
          <CheckCircle className="h-5 w-5 text-green-600" />
        )

      case 'pending':
        return (
          <Clock className="h-5 w-5 text-yellow-600" />
        )

      case 'inconclusive':
        return (
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        )
    }
  }

  // =========================
  // STATUS STYLES
  // =========================

  const getStatusStyles = (status: Patient['status']) => {

    const styles = {
      positive:
        'bg-destructive/10 text-destructive border-destructive/20',

      negative:
        'bg-green-100 text-green-700 border-green-200',

      pending:
        'bg-yellow-100 text-yellow-700 border-yellow-200',

      inconclusive:
        'bg-muted text-muted-foreground border-border'
    }

    return styles[status]
  }

  // =========================
  // RISK STYLES
  // =========================

  const getRiskStyles = (
    risk?: 'low' | 'moderate' | 'high'
  ) => {

    const styles = {

      low:
        'bg-green-100 text-green-700',

      moderate:
        'bg-yellow-100 text-yellow-700',

      high:
        'bg-destructive/10 text-destructive'
    }

    return risk
      ? styles[risk]
      : 'bg-muted text-muted-foreground'
  }

  return (

    <DashboardLayout role="doctor">

<div className="space-y-6">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>

            <Link
              href="/dashboard/doctor/patients"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
            >

              <ArrowLeft className="h-4 w-4 mr-2" />

              Back to Patients

            </Link>

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">

                <span className="text-2xl font-bold text-primary">

                  {patient.name
                    ? patient.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                    : 'P'}

                </span>

              </div>

              <div>

                <h1 className="text-2xl font-bold">
                  {patient.name}
                </h1>

                <p className="text-muted-foreground">

                  {patient.age} years old •{' '}

                  {patient.gender === 'female'
                    ? 'Female'
                    : patient.gender === 'male'
                      ? 'Male'
                      : 'Other'}

                </p>

              </div>

            </div>

          </div>

          <div className="flex flex-wrap gap-2">

            <Button onClick={handleExportPDF}>
  <Download className="h-4 w-4 mr-2" />
  Export Report
</Button>

<Button variant="outline" onClick={handlePrint}>
  <Printer className="h-4 w-4 mr-2" />
  Print
</Button>

<Button variant="outline" onClick={handleShare}>
  <Share2 className="h-4 w-4 mr-2" />
  Share
</Button>

          </div>

        </div>
<div
  className="bg-white text-black p-6 rounded-lg"
>
        {/* MAIN GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* PATIENT INFO */}

          <Card>

            <CardHeader>

              <CardTitle className="flex items-center gap-2">

                <User className="h-5 w-5 text-primary" />

                Patient Information

              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <div>

                <p className="text-sm text-muted-foreground">
                  Full Name
                </p>

                <p className="font-medium">
                  {patient.name}
                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Age
                </p>

                <p className="font-medium">
                  {patient.age} years
                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Gender
                </p>

                <p className="font-medium capitalize">
                  {patient.gender}
                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Condition
                </p>

                <p className="font-medium">
                  {patient.disease}
                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Notes
                </p>

                <p className="font-medium">
                  {patient.notes || 'N/A'}
                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Patient ID
                </p>

                <p className="font-mono text-sm break-all">
                 {patient.patientUniqueId}
                </p>

              </div>

            </CardContent>

          </Card>

          {/* SCAN DETAILS */}

          <Card>

            <CardHeader>

              <CardTitle className="flex items-center gap-2">

                <FileImage className="h-5 w-5 text-primary" />

                Scan Details

              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <div>

                <p className="text-sm text-muted-foreground">
                  Scan Type
                </p>

                <p className="font-medium">
                  {patient.scanType}
                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Created At
                </p>

                <p className="font-medium">

                  {patient.createdAt?.seconds
                    ? new Date(
                        patient.createdAt.seconds * 1000
                      ).toLocaleString()
                    : 'N/A'}

                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Status
                </p>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium capitalize border mt-1 ${getStatusStyles(patient.status)}`}
                >

                  {getStatusIcon(patient.status)}

                  {patient.status}

                </span>

              </div>

            </CardContent>

          </Card>

          {/* ANALYSIS SUMMARY */}

          <Card>

            <CardHeader>

              <CardTitle className="flex items-center gap-2">

                <Activity className="h-5 w-5 text-primary" />

                Analysis Summary

              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              {patient.aiAnalysis ? (

                <>

                  <div>

                    <p className="text-sm text-muted-foreground mb-2">
                      AI Confidence
                    </p>

                    <div className="flex items-center gap-3">

                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">

                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{
                            width: `${patient.aiAnalysis.confidence}%`
                          }}
                        />

                      </div>

                      <span className="font-bold text-lg">

                        {patient.aiAnalysis.confidence}%

                      </span>

                    </div>

                  </div>

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Risk Level
                    </p>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium capitalize mt-1 ${getRiskStyles(patient.aiAnalysis.riskLevel)}`}
                    >

                      <Shield className="h-4 w-4" />

                      {patient.aiAnalysis.riskLevel} Risk

                    </span>

                  </div>

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Findings Count
                    </p>

                    <p className="text-2xl font-bold">

                      {patient.aiAnalysis.findings?.length || 0}

                    </p>

                  </div>

                </>

              ) : (

                <div className="text-center py-4">

                  <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />

                  <p className="text-muted-foreground">

                    Analysis pending

                  </p>

                </div>

              )}

            </CardContent>

          </Card>

        </div>

        {/* AI ANALYSIS */}

        {patient.aiAnalysis && (

          <Card className="border-2 border-primary/20">

            <CardHeader className="bg-primary/5">

              <CardTitle className="flex items-center gap-2">

                <Brain className="h-6 w-6 text-primary" />

                AI Analysis Results

              </CardTitle>

              <CardDescription>

                Automated analysis powered by OncoScanXai AI

              </CardDescription>

            </CardHeader>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* FINDINGS */}

                <div>

                  <h4 className="font-semibold mb-4 flex items-center gap-2">

                    <TrendingUp className="h-5 w-5 text-primary" />

                    Key Findings

                  </h4>

                  <ul className="space-y-3">

                    {patient.aiAnalysis.findings?.map(
                      (finding: string, index: number) => (

                        <li
                          key={index}
                          className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                        >

                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center shrink-0">

                            {index + 1}

                          </span>

                          <span className="text-sm">
                            {finding}
                          </span>

                        </li>
                      )
                    )}

                  </ul>

                </div>

                {/* RECOMMENDATION */}

                <div>

                  <h4 className="font-semibold mb-4 flex items-center gap-2">

                    <CheckCircle className="h-5 w-5 text-primary" />

                    Recommendation

                  </h4>

                  <div
                    className={`p-4 rounded-lg border ${
                      patient.aiAnalysis.riskLevel === 'high'
                        ? 'bg-destructive/5 border-destructive/20'
                        : patient.aiAnalysis.riskLevel === 'moderate'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-green-50 border-green-200'
                    }`}
                  >

                    <p className="text-sm leading-relaxed">

                      {patient.aiAnalysis.recommendation}

                    </p>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        )}
</div>
      </div>

    </DashboardLayout>
  )
}