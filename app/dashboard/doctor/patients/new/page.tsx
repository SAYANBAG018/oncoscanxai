'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useStore } from '@/lib/store'
import { 
  ArrowLeft,
  Upload,
  User,
  FileImage,
  Loader2,
  CheckCircle,
  Brain,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import {
  collection,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore'

import { db } from '@/lib/firebase'



export default function NewPatientPage() {
  const router = useRouter()
 const { currentUser } = useStore()
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'female' as 'male' | 'female' | 'other',
    disease: '',
    scanType: 'Mammogram' as 'MRI' | 'Mammogram' | 'Both',
    notes: ''
  })
  const [scanFile, setScanFile] = useState<File | null>(null)
  const [scanPreview, setScanPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [newPatientId, setNewPatientId] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setScanFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setScanPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    setIsSubmitting(true)
    setIsAnalyzing(true)

    // Fake AI Result For Now
    const aiResult = {
      status: 'positive',
      confidence: 94,
      riskLevel: 'high',
      findings: [
        'Suspicious tissue detected',
        'Irregular mass observed'
      ],
      recommendation: 'Consult oncologist immediately'
    }

    // Create Firestore document
    const patientRef = doc(collection(db, 'patients'))

    await setDoc(patientRef, {
      id: patientRef.id,

      name: formData.name,
      age: Number(formData.age),
      gender: formData.gender,
      disease: formData.disease,
      scanType: formData.scanType,
      notes: formData.notes,

      doctorId: currentUser?.id || '',

      status: aiResult.status,

      aiAnalysis: {
        confidence: aiResult.confidence,
        findings: aiResult.findings,
        recommendation: aiResult.recommendation,
        riskLevel: aiResult.riskLevel
      },

      createdAt: serverTimestamp()
    })

    setNewPatientId(patientRef.id)

    setSuccess(true)

  } catch (error) {
    console.error(error)
    alert('Failed to save patient')
  } finally {
    setIsSubmitting(false)
    setIsAnalyzing(false)
  }
}

  if (success) {
    return (
      <DashboardLayout role="doctor">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2">
            <CardContent className="pt-12 pb-8 text-center">
              {isAnalyzing ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Brain className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">AI Analysis in Progress</h2>
                  <p className="text-muted-foreground mb-4">
                    Our AI is analyzing the scan for {formData.name}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing scan data...</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Patient Added Successfully!</h2>
                  <p className="text-muted-foreground mb-6">
                    AI analysis complete for {formData.name}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href={`/dashboard/doctor/patients/${newPatientId}`}>
                      <Button>
                        View Patient Details
                      </Button>
                    </Link>
                    <Link href="/dashboard/doctor/patients">
                      <Button variant="outline">
                        Back to Patients
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="doctor">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link 
            href="/dashboard/doctor/patients" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Link>
          <h1 className="text-2xl font-bold">Register New Patient</h1>
          <p className="text-muted-foreground">Add patient information and upload scan for AI analysis</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Patient Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Patient Information
              </CardTitle>
              <CardDescription>Enter the patient details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter patient name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter age"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: 'male' | 'female' | 'other') => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disease">Condition/Reason for Scan *</Label>
                  <Input
                    id="disease"
                    placeholder="e.g., Routine Screening, Family History"
                    value={formData.disease}
                    onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scan Upload */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5 text-primary" />
                Scan Upload
              </CardTitle>
              <CardDescription>Upload MRI or Mammogram scan images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scanType">Scan Type *</Label>
                <Select
                  value={formData.scanType}
                  onValueChange={(value: 'MRI' | 'Mammogram' | 'Both') => setFormData({ ...formData, scanType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mammogram">Mammogram</SelectItem>
                    <SelectItem value="MRI">MRI</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Upload Scan Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  {scanPreview ? (
                    <div className="space-y-4">
                      <img 
                        src={scanPreview} 
                        alt="Scan preview" 
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">{scanFile?.name}</p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setScanFile(null)
                          setScanPreview(null)
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        PNG, JPG, DICOM up to 10MB
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about the patient or scan..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis Notice */}
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">AI Analysis</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Once submitted, our AI system will automatically analyze the scan and provide detection results, 
                    risk assessment, and recommendations. This typically takes 2-3 minutes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Link href="/dashboard/doctor/patients">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Register & Analyze
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
