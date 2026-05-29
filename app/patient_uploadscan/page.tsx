'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Upload,
  Brain,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowLeft,
} from 'lucide-react'

import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type AnalysisResult = {
  prediction: string
  confidence: number
  risk: string
  recommendation: string
}

export default function PatientUploadScanPage() {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/dicom',
    'application/dicom+json',
    '',
  ]

  const allowedExtensions = ['png', 'jpg', 'jpeg', 'dcm']

  const handleFile = (selectedFile: File) => {
    const extension = selectedFile.name.split('.').pop()?.toLowerCase()

    const isValidType =
      allowedTypes.includes(selectedFile.type) ||
      (extension && allowedExtensions.includes(extension))

    if (!isValidType) {
      alert('Only PNG, JPG, JPEG, and DICOM (.dcm) files are allowed.')
      return
    }

    setFile(selectedFile)
    setResult(null)
  }

  const simulateAnalysis = async () => {
    if (!file) return

    setLoading(true)
    setResult(null)

    const steps = [
      'Uploading scan...',
      'Validating medical image...',
      'Preprocessing scan...',
      'Running AI diagnostic model...',
      'Generating analysis...',
    ]

    for (const s of steps) {
      setStep(s)
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    setResult({
      prediction: 'Suspicious',
      confidence: 96.4,
      risk: 'High Risk',
      recommendation:
        'AI suggests further clinical evaluation with a radiologist.',
    })

    setLoading(false)
    setStep('')
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-white to-pink-100" />
      <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />
      <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-pink-400/20 blur-3xl" />

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="border-b border-white/20 bg-white/60 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="rounded-xl">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>

            <Logo size="lg" />
          </div>
        </nav>

        {/* Main */}
        <main className="max-w-5xl mx-auto px-6 py-16">
          {/* Hero */}
          <section className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/70 px-4 py-2 backdrop-blur">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">
                AI-Powered Breast Cancer Screening
              </span>
            </div>

            <h2 className="mt-6 text-5xl font-extrabold leading-tight">
              Upload Your
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                {' '}
                Breast Scan
              </span>
            </h2>

            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your mammogram, MRI, or DICOM scan and receive instant
              AI-powered diagnostic analysis.
            </p>
          </section>

          {/* Upload Section */}
          {!result && (
            <Card className="border-white/30 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Upload Medical Scan</CardTitle>
                <CardDescription>
                  Supported formats: PNG, JPG, JPEG, DICOM (.dcm)
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragging(true)
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragging(false)

                    if (e.dataTransfer.files?.[0]) {
                      handleFile(e.dataTransfer.files[0])
                    }
                  }}
                  className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300 ${
                    dragging
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-zinc-300'
                  }`}
                >
                  <Upload className="h-16 w-16 mx-auto text-purple-600 mb-6" />

                  <h3 className="text-xl font-semibold mb-3">
                    Drag & Drop Your Scan Here
                  </h3>

                  <p className="text-muted-foreground mb-6">
                    Mammogram, MRI, or DICOM (.dcm) image
                  </p>

                  <input
                    type="file"
                    id="scan-upload"
                    accept=".png,.jpg,.jpeg,.dcm,application/dicom"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFile(e.target.files[0])
                      }
                    }}
                  />

                  <label htmlFor="scan-upload">
                    <Button
                      type="button"
                      asChild
                      className="rounded-xl cursor-pointer"
                    >
                      <span>Select Scan File</span>
                    </Button>
                  </label>
                </div>

                {/* File Preview */}
                {file && (
                  <div className="mt-8 p-4 rounded-2xl bg-zinc-50 border flex items-center justify-between">
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFile(null)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                )}

                {/* Analyze */}
                {file && !loading && (
                  <Button
                    onClick={simulateAnalysis}
                    className="w-full mt-8 h-14 rounded-2xl text-lg bg-gradient-to-r from-purple-600 to-pink-500"
                  >
                    <Brain className="mr-2 h-5 w-5" />
                    Analyze Scan
                  </Button>
                )}

                {/* Loading */}
                {loading && (
                  <div className="mt-8 text-center space-y-5">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-purple-600" />

                    <p className="text-lg font-medium">{step}</p>

                    <div className="w-full bg-zinc-200 rounded-full h-3 overflow-hidden">
                      <div className="h-full w-full animate-pulse bg-gradient-to-r from-purple-600 to-pink-500" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && (
            <Card className="border-white/30 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-10 w-10 text-red-500" />
                </div>

                <CardTitle className="text-3xl">AI Analysis Result</CardTitle>

                <CardDescription>
                  Preliminary AI-generated diagnostic assessment
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="rounded-2xl bg-zinc-50 p-6 text-center">
                    <p className="text-sm text-muted-foreground">Prediction</p>
                    <p className="text-xl font-bold">{result.prediction}</p>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-6 text-center">
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="text-xl font-bold">{result.confidence}%</p>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-6 text-center">
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <p className="text-xl font-bold text-red-500">
                      {result.risk}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border bg-zinc-50 p-6">
                  <h3 className="font-semibold mb-3">Recommendation</h3>
                  <p className="text-muted-foreground">
                    {result.recommendation}
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full h-14 rounded-2xl"
                  onClick={() => {
                    setFile(null)
                    setResult(null)
                  }}
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Upload Another Scan
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 28e9005 (doctor update)
