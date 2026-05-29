'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  type ConfirmationResult,
} from 'firebase/auth'

import {
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'

/*
  IMPORTANT:
  auth     -> Email/Password Auth
  otpAuth  -> Phone OTP Auth
*/
import { auth, db, otpAuth } from '@/lib/firebase'

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  ArrowLeft,
  Stethoscope,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
} from 'lucide-react'

const specializations = [
  'Radiologist',
  'Breast Imaging Specialist',
  'Medical Oncologist',
  'Surgical Oncologist',
  'Radiation Oncologist',
  'Pathologist',
  'General Surgeon',
  'Gynecologic Oncologist',
  'Other',
]

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier
  }
}

export default function DoctorRegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    specialization: '',
    hospitalName: '',
    mobile: '',
    mobileOtp: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null)

  const [mobileVerified, setMobileVerified] =
    useState(false)

  const [emailVerificationSent, setEmailVerificationSent] =
    useState(false)

  const [showPassword, setShowPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [success, setSuccess] = useState(false)

  /*
    FIXED reCAPTCHA
  */
  useEffect(() => {
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = undefined
      }

      window.recaptchaVerifier =
        new RecaptchaVerifier(
          otpAuth,
          'recaptcha-container',
          {
            size: 'invisible',
            callback: () => {
              console.log('reCAPTCHA verified')
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired')

              setError(
                'reCAPTCHA expired. Please try again.'
              )

              window.recaptchaVerifier =
                undefined
            },
          }
        )

      console.log(
        'reCAPTCHA initialized successfully'
      )
    } catch (error) {
      console.error(
        'reCAPTCHA init error:',
        error
      )
    }

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = undefined
      }
    }
  }, [])

  /*
    SEND OTP
  */
  const sendMobileOtp = async () => {
    setError('')
    setInfo('')

    try {
      const phone = formData.mobile.trim()

      if (!/^[0-9]{10}$/.test(phone)) {
        setError(
          'Enter valid 10-digit mobile number'
        )
        return
      }

      /*
        Recreate verifier if missing
      */
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier =
          new RecaptchaVerifier(
            otpAuth,
            'recaptcha-container',
            {
              size: 'invisible',
            }
          )
      }

      setIsLoading(true)

      const confirmation =
        await signInWithPhoneNumber(
          otpAuth,
          `+91${phone}`,
          window.recaptchaVerifier
        )

      setConfirmationResult(confirmation)
      setOtpSent(true)

      setInfo('OTP sent successfully')
    } catch (err: any) {
      console.error('OTP Error:', err)

      /*
        Reset bad verifier
      */
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = undefined
      }

      if (
        err.code === 'auth/invalid-phone-number'
      ) {
        setError('Invalid phone number')
      } else if (
        err.code === 'auth/too-many-requests'
      ) {
        setError(
          'Too many requests. Try again later.'
        )
      } else if (
        err.code ===
        'auth/operation-not-allowed'
      ) {
        setError(
          'Phone Authentication is not enabled in Firebase.'
        )
      } else if (
        err.code ===
        'auth/invalid-app-credential'
      ) {
        setError(
          'Invalid app credential. Check Firebase Phone Auth + Authorized Domains.'
        )
      } else {
        setError(
          err.message || 'Failed to send OTP'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  /*
    VERIFY OTP
  */
  const verifyMobileOtp = async () => {
    try {
      setError('')
      setInfo('')

      if (!confirmationResult) {
        setError('Send OTP first')
        return
      }

      if (!formData.mobileOtp.trim()) {
        setError('Enter OTP')
        return
      }

      setIsLoading(true)

      await confirmationResult.confirm(
        formData.mobileOtp
      )

      setMobileVerified(true)

      setInfo('Mobile verified successfully')

      /*
        IMPORTANT:
        REMOVED THIS:
        await signOut(auth)

        It was breaking auth session
      */
    } catch (err: any) {
      console.error(err)

      if (
        err.code ===
        'auth/invalid-verification-code'
      ) {
        setError('Invalid OTP')
      } else if (
        err.code === 'auth/code-expired'
      ) {
        setError(
          'OTP expired. Please resend OTP.'
        )
      } else {
        setError(
          err.message || 'OTP verification failed'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  /*
    SEND EMAIL VERIFICATION
  */
  const sendEmailVerificationLink =
    async () => {
      setError('')
      setInfo('')

      try {
        if (!mobileVerified) {
          setError(
            'Verify mobile number first.'
          )
          return
        }

        if (!formData.email) {
          setError('Enter email address.')
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
          setError('Passwords do not match.')
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
          'Verification email sent. Verify your email, then click Create Account.'
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

  /*
    FINAL SUBMIT
  */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setError('')
    setInfo('')
    setIsLoading(true)

    try {
      if (!mobileVerified) {
        setError(
          'Complete mobile verification.'
        )
        return
      }

      if (!emailVerificationSent) {
        setError(
          'Send email verification first.'
        )
        return
      }

      if (!auth.currentUser) {
        setError(
          'Authentication session missing.'
        )
        return
      }

      await auth.currentUser.reload()

      if (!auth.currentUser.emailVerified) {
        setError(
          'Please verify your email first.'
        )
        return
      }

      await setDoc(
        doc(
          db,
          'doctors',
          auth.currentUser.uid
        ),
        {
          uid: auth.currentUser.uid,
          role: 'doctor',
          fullName: formData.name,
          licenseNumber:
            formData.licenseNumber,
          specialization:
            formData.specialization,
          hospitalName:
            formData.hospitalName,
          mobile: formData.mobile,
          email: formData.email,
          mobileVerified: true,
          emailVerified: true,
          createdAt: serverTimestamp(),
        }
      )

      setSuccess(true)

      setTimeout(async () => {
        await signOut(auth)

        router.push(
          '/auth/doctor/login'
        )
      }, 3000)
    } catch (err: any) {
      console.error(err)

      setError(
        err.message ||
          'Registration failed.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  /*
    SUCCESS SCREEN
  */
  if (success) {
    return (
      <div className="min-h-screen bg-background gradient-mesh flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardContent className="pt-10">
            <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />

            <h2 className="text-2xl font-bold">
              Registration Successful
            </h2>

            <p className="text-muted-foreground mt-2">
              Redirecting to login...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background gradient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        <Link
          href="/"
          className="inline-flex items-center mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Stethoscope className="h-10 w-10" />
            </div>

            <CardTitle>
              Doctor Registration
            </CardTitle>

            <CardDescription>
              Register your doctor account
            </CardDescription>
          </CardHeader>

          <CardContent>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <Input
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Medical License Number"
                required
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    licenseNumber:
                      e.target.value,
                  })
                }
              />

              <Select
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    specialization: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>

                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem
                      key={spec}
                      value={spec}
                    >
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Hospital Name"
                value={formData.hospitalName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hospitalName:
                      e.target.value,
                  })
                }
              />

              {/* MOBILE OTP */}

              <div className="flex gap-2">
                <Input
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  disabled={mobileVerified}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mobile: e.target.value,
                    })
                  }
                />

                <Button
                  type="button"
                  onClick={sendMobileOtp}
                  disabled={
                    isLoading ||
                    mobileVerified
                  }
                >
                  {otpSent
                    ? 'Resend OTP'
                    : 'Send OTP'}
                </Button>
              </div>

              {otpSent &&
                !mobileVerified && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter OTP"
                      value={
                        formData.mobileOtp
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mobileOtp:
                            e.target.value,
                        })
                      }
                    />

                    <Button
                      type="button"
                      onClick={
                        verifyMobileOtp
                      }
                    >
                      Verify OTP
                    </Button>
                  </div>
                )}

              {mobileVerified && (
                <p className="text-green-600 text-sm">
                  ✓ Mobile verified
                </p>
              )}

              {/* EMAIL */}

              <Input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />

              {/* PASSWORD */}

              <div className="relative">
                <Input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password:
                        e.target.value,
                    })
                  }
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

              <div className="relative">
                <Input
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Confirm Password"
                  required
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

              {/* EMAIL VERIFICATION */}

              <Button
                type="button"
                variant="outline"
                onClick={
                  sendEmailVerificationLink
                }
                className="w-full"
                disabled={
                  !mobileVerified ||
                  isLoading
                }
              >
                Send Email Verification
              </Button>

              {/* MESSAGES */}

              {error && (
                <p className="text-red-600 text-sm">
                  {error}
                </p>
              )}

              {info && (
                <p className="text-blue-600 text-sm">
                  {info}
                </p>
              )}

              {/* SUBMIT */}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/doctor/login"
                className="text-primary hover:underline"
              >
                Already have an account? Sign In
              </Link>
            </div>

          </CardContent>

          {/* REQUIRED */}
          <div id="recaptcha-container"></div>

        </Card>

        <div className="mt-6 flex justify-center">
          <Logo size="sm" />
        </div>

      </div>
    </div>
  )
}
