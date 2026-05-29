'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from 'firebase/auth'

import {
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'

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
  Shield,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
} from 'lucide-react'

export default function AdminRegisterPage() {
  const router = useRouter()

  // =========================
  // FORM DATA
  // =========================
  const [formData, setFormData] = useState({
    name: '',
    hospitalName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    privacyAccepted: false,
  })

  // =========================
  // UI STATE
  // =========================
  const [showPassword, setShowPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [
    emailVerificationSent,
    setEmailVerificationSent,
  ] = useState(false)

  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [isLoading, setIsLoading] =
    useState(false)

  const [success, setSuccess] =
    useState(false)

  // =========================
  // SEND EMAIL VERIFICATION
  // =========================
 const sendEmailVerificationLink =
  async () => {
    setError('')
    setInfo('')

    try {
      if (!formData.email) {
        setError(
          'Enter email address.'
        )
        return
      }

      if (!formData.password) {
        setError('Enter password.')
        return
      }

      if (
        formData.password.length < 6
      ) {
        setError(
          'Password must be at least 6 characters.'
        )
        return
      }

      if (
        formData.password !==
        formData.confirmPassword
      ) {
        setError(
          'Passwords do not match.'
        )
        return
      }

      setIsLoading(true)

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password
        )

      await sendEmailVerification(
        userCredential.user
      )

      setEmailVerificationSent(true)
      setInfo(
  'Verification email sent. Verify your email, then click Create Admin Account.'
)
    } catch (err: any) {
      console.error(err)

      if (
        err.code ===
        'auth/email-already-in-use'
      ) {
        setError(
          'Email already registered.'
        )
      } else {
        setError(
          err.message ||
            'Failed to send verification email.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }
  // =========================
  // HANDLE SUBMIT
  // =========================
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setError('')

    if (!emailVerificationSent) {
      setError(
        'Please verify your email first'
      )
      return
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError(
        'Password must be at least 6 characters'
      )
      return
    }

    if (!formData.termsAccepted) {
      setError(
        'Please accept the Terms & Conditions'
      )
      return
    }

    if (!formData.privacyAccepted) {
      setError(
        'Please accept the Privacy Policy'
      )
      return
    }

    if (!auth.currentUser) {
      setError(
        'Authentication session missing'
      )
      return
    }

    setIsLoading(true)

    try {
      await auth.currentUser.reload()

      if (!auth.currentUser.emailVerified) {
        setError(
          'Please verify your email from inbox'
        )
        return
      }

      // =========================
      // SAVE ADMIN TO FIRESTORE
      // =========================
      await setDoc(
        doc(
          db,
          'admins',
          auth.currentUser.uid
        ),
        {
          uid: auth.currentUser.uid,
          role: 'admin',
          fullName: formData.name,
          hospitalName:
            formData.hospitalName,
          email: formData.email,
          emailVerified: true,
          status: 'approved',
          createdAt: serverTimestamp(),
        }
      )

      setSuccess(true)

      setTimeout(async () => {
        await signOut(auth)

        router.push('/auth/admin/login')
      }, 2500)
    } catch (err: any) {
      console.error(err)

      setError(
        err.message ||
          'Registration failed'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // =========================
  // SUCCESS SCREEN
  // =========================
  if (success) {
    return (
      <div className="min-h-screen bg-background gradient-mesh flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold mb-2">
              Registration Successful!
            </h2>

            <p className="text-muted-foreground mb-4">
              Your administrator account has
              been created successfully.
            </p>

            <p className="text-sm text-muted-foreground">
              Redirecting to admin login...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // =========================
  // MAIN PAGE
  // =========================
  return (
    <div className="min-h-screen bg-background gradient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Registration Card */}
        <Card className="border-2 border-accent/30 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-accent" />
              </div>
            </div>

            <CardTitle className="text-3xl font-bold">
              Admin Registration
            </CardTitle>

            <CardDescription>
              Join OncoScanXAI Administration
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* ========================= */}
              {/* ADMIN INFO */}
              {/* ========================= */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Administrative Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name
                  </Label>

                  <Input
                    id="name"
                    placeholder="Sayan Bag"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Hospital */}
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">
                    Hospital / Organization
                    Name
                  </Label>

                  <Input
                    id="hospitalName"
                    placeholder="Apollo Hospital Kolkata"
                    value={
                      formData.hospitalName
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hospitalName:
                          e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              {/* ========================= */}
              {/* CONTACT VERIFICATION */}
              {/* ========================= */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Contact Verification
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Official Email Address
                </Label>

                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@hospital.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    required
                  />

                  <Button
  type="button"
  variant="outline"
  className="shrink-0"
  onClick={sendEmailVerificationLink}
  disabled={
    emailVerificationSent ||
    isLoading
  }
>
  {emailVerificationSent
    ? '✓ Verification Sent'
    : 'Verify Email'}
</Button>
                </div>

                {emailVerificationSent && (
                  <p className="text-sm text-green-600 font-medium">
                    Verification email sent ✓
                  </p>
                )}
              </div>

              {/* ========================= */}
              {/* SECURITY */}
              {/* ========================= */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Security
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
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
                      placeholder="Enter a strong password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password:
                            e.target.value,
                        })
                      }
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password
                  </Label>

                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      placeholder="Re-enter your password"
                      value={
                        formData.confirmPassword
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword:
                            e.target.value,
                        })
                      }
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* ========================= */}
              {/* LEGAL */}
              {/* ========================= */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Legal Agreement
                </h3>
              </div>

              <div className="space-y-3 text-sm">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={
                      formData.termsAccepted
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        termsAccepted:
                          e.target.checked,
                      })
                    }
                    className="mt-1"
                  />

                  <span>
                    I agree to the Terms &
                    Conditions
                  </span>
                </label>

                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={
                      formData.privacyAccepted
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        privacyAccepted:
                          e.target.checked,
                      })
                    }
                    className="mt-1"
                  />

                  <span>
                    I agree to the Privacy
                    Policy
                  </span>
                </label>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-600 font-medium">
                  {error}
                </p>
              )}
              {info && (
  <p className="text-sm text-blue-600 font-medium">
    {info}
  </p>
)}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Admin Account'
                )}
              </Button>
            </form>

            {/* Login */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{' '}
              </span>

              <Link
                href="/auth/admin/login"
                className="text-accent hover:underline font-medium"
              >
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Logo */}
        <div className="mt-8 flex justify-center">
          <Logo size="sm" />
        </div>
      </div>
    </div>
  )
}