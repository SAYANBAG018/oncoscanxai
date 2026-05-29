'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Brain, FileImage, Loader2 } 
from 'lucide-react'

import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function UploadScanPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setLoading(true)

    // Fake AI processing
    await new Promise((resolve) => setTimeout(resolve, 2500))

    setResult(
      'AI detected suspicious abnormal tissue patterns. Further medical evaluation is recommended.'
    )

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background gradient-mesh p-6">
      <div className="max-w-5xl mx-auto">

        {/* Top */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard/patient"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>

          <Logo size="sm" />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Upload MRI Scan
          </h1>

          <p className="text-muted-foreground mt-2">
            Upload MRI or mammogram scans and receive AI-powered insights
          </p>
        </div>

        {/* Upload Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-500" />
              Upload Scan
            </CardTitle>

            <CardDescription>
              Supported formats: JPG, PNG, DICOM
            </CardDescription>
          </CardHeader>

          <CardContent>

            <div className="border-2 border-dashed rounded-2xl p-12 text-center">

              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
                  <FileImage className="w-10 h-10 text-purple-600" />
                </div>
              </div>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.dcm"
                onChange={handleFileChange}
                className="mb-6"
              />

              {selectedFile && (
                <div className="mb-6">
                  <p className="font-medium">
                    Selected File:
                  </p>

                  <p className="text-muted-foreground text-sm">
                    {selectedFile.name}
                  </p>
                </div>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={!selectedFile || loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate AI Insights
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Result */}
        <Card className="border-2 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              AI Insights
            </CardTitle>

            <CardDescription>
              AI-generated scan analysis result
            </CardDescription>
          </CardHeader>

          <CardContent>

            {!result ? (
              <div className="p-10 text-center text-muted-foreground border rounded-2xl">
                Upload a scan and click analyze to generate insights.
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-red-50 border border-red-200">
                <h3 className="font-semibold text-red-600 mb-2">
                  Positive Detection
                </h3>

                <p className="text-sm text-muted-foreground">
                  {result}
                </p>
              </div>
            )}

          </CardContent>
        </Card>

      </div>
    </div>
  )
}