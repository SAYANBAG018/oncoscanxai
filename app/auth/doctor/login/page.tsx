'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { auth, db } from '@/lib/firebase'

import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
  ArrowLeft,
  Stethoscope,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react'

export default function DoctorLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

 const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault()

  setError('')
  setIsLoading(true)

  try {
    // 1. Sign in with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    )

    const user = userCredential.user

    // 2. Reload user to get latest email verification status
    await user.reload()

    // 3. Check if email is verified
    if (!user.emailVerified) {
      await signOut(auth)
      setError('Please verify your email before logging in.')
      return
    }

    // 4. Get doctor document from Firestore
    const doctorRef = doc(db, 'doctors', user.uid)
    const doctorSnap = await getDoc(doctorRef)

    // 5. Check if doctor document exists
    if (!doctorSnap.exists()) {
      await signOut(auth)
      setError('Doctor account not found.')
      return
    }

    const doctorData = doctorSnap.data()

    // 6. Verify role
    if (doctorData.role !== 'doctor') {
      await signOut(auth)
      setError('Unauthorized account access.')
      return
    }

    // 7. Verify mobile number
    if (!doctorData.mobileVerified) {
      await signOut(auth)
      setError('Please complete mobile verification.')
      return
    }

    // 8. Save doctor info in Zustand store
  // 8. Save doctor info in Zustand store
const { useStore } = await import('@/lib/store')

useStore.getState().login({
  id: user.uid,
  name:
    doctorData.fullName ||
    doctorData.name ||
    'Doctor',
  email: user.email || '',
  role: 'doctor',
})

// 9. Redirect to doctor dashboard
window.location.href = '/dashboard/doctor'
  } catch (err: any) {
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/wrong-password' ||
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/invalid-email'
    ) {
      setError('Invalid email or password.')
    } else {
      setError(err.message || 'Login failed.')
    }
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-background gradient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="border-2 shadow-xl rounded-3xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-8 w-8 text-primary" />
              </div>
            </div>

            <CardTitle className="text-2xl font-bold">
              Doctor Login
            </CardTitle>

            <CardDescription>
              Sign in to your verified doctor account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 font-medium">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Don&apos;t have an account?{' '}
              </span>

              <Link
                href="/auth/doctor/register"
                className="text-primary hover:underline font-medium"
              >
                Register here
              </Link>
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
