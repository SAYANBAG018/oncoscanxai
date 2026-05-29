'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStore, demoCredentials } from '@/lib/store'
import { ArrowLeft, UserCircle, Loader2, AlertCircle } from 'lucide-react'

export default function GuestLoginPage() {
  const router = useRouter()
  const { login, patients, setGuestPatientId } = useStore()
  
  const [patientId, setPatientId] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const patient = patients.find(p => p.id === patientId.toLowerCase())
    
    if (patient) {
      login({
        id: `guest-${patientId}`,
        name: patient.name,
        email: '',
        role: 'guest'
      })
      setGuestPatientId(patient.id)
      router.push('/dashboard/patient')
    } else {
      setError('Patient ID not found. Please check your ID and try again.')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background gradient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="border-2">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <UserCircle className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Patient Access</CardTitle>
            <CardDescription>
              Enter your patient ID to view your scan results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  type="text"
                  placeholder="e.g., p1"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                  className="uppercase"
                />
                <p className="text-xs text-muted-foreground">
                  Your patient ID was provided by your healthcare provider
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button type="submit" variant="secondary" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Accessing records...
                  </>
                ) : (
                  'View My Results'
                )}
              </Button>
            </form>

            <div className="mt-6 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Demo Patient IDs:</p>
              <p>p1 - Sarah Johnson (Positive)</p>
              <p>p2 - Emily Chen (Negative)</p>
              <p>p4 - Lisa Williams (Inconclusive)</p>
            </div>

            <div className="mt-6 p-4 border border-border rounded-lg">
              <h4 className="font-medium text-sm mb-2">Need Help?</h4>
              <p className="text-xs text-muted-foreground">
                If you {"don't"} have a patient ID or {"can't"} find your records, please contact your healthcare provider or call our support line.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center">
          <Logo size="sm" />
        </div>
      </div>
    </div>
  )
}
