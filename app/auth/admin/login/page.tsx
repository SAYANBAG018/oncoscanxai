'use client'

import { useState } from 'react'
import Link from 'next/link'

import { signInWithEmailAndPassword, signOut } from 'firebase/auth'

import {
  doc,
  getDoc,
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
} from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [error, setError] =
    useState('')

  const [isLoading, setIsLoading] =
    useState(false)

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    setError('')
    setIsLoading(true)

    try {
      // =========================
      // FIREBASE LOGIN
      // =========================
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        )

      const user =
        userCredential.user

      // =========================
      // RELOAD USER
      // =========================
      await user.reload()

      // =========================
      // VERIFY EMAIL
      // =========================
      if (!user.emailVerified) {
        await signOut(auth)

        setError(
          'Please verify your email before logging in.'
        )

        return
      }

      // =========================
      // GET ADMIN FROM FIRESTORE
      // =========================
      const adminRef = doc(
        db,
        'admins',
        user.uid
      )

      const adminSnap =
        await getDoc(adminRef)

      // =========================
      // CHECK ADMIN EXISTS
      // =========================
      if (!adminSnap.exists()) {
        await signOut(auth)

        setError(
          'Admin account not found.'
        )

        return
      }

      const adminData =
        adminSnap.data()

      // =========================
      // VERIFY ROLE
      // =========================
      if (
        adminData.role !== 'admin'
      ) {
        await signOut(auth)

        setError(
          'Unauthorized account access.'
        )

        return
      }

      // =========================
      // VERIFY STATUS
      // =========================
      if (
        adminData.status !==
        'approved'
      ) {
        await signOut(auth)

        setError(
          'Admin account is not approved.'
        )

        return
      }

      // =========================
      // SAVE TO ZUSTAND
      // =========================
      const { useStore } =
        await import('@/lib/store')

      useStore.getState().login({
        id: user.uid,
        name:
          adminData.fullName ||
          adminData.name ||
          'Admin',
        email:
          user.email || '',
        role: 'admin',
      })

      // =========================
      // REDIRECT
      // =========================
      window.location.href =
        '/dashboard/admin'
    } catch (err: any) {
      console.error(err)

      if (
        err.code ===
          'auth/user-not-found' ||
        err.code ===
          'auth/wrong-password' ||
        err.code ===
          'auth/invalid-credential' ||
        err.code ===
          'auth/invalid-email'
      ) {
        setError(
          'Invalid email or password.'
        )
      } else {
        setError(
          err.message ||
            'Login failed.'
        )
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

        <Card className="border-2 border-accent/30 shadow-xl rounded-3xl">

          <CardHeader className="text-center pb-4">

            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-accent" />
              </div>
            </div>

            <CardTitle className="text-2xl font-bold">
              Admin Login
            </CardTitle>

            <CardDescription>
              Sign in to your verified admin account
            </CardDescription>

          </CardHeader>

          <CardContent>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="admin@hospital.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              {/* PASSWORD */}
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
                      setPassword(
                        e.target.value
                      )
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

              {/* ERROR */}
              {error && (
                <p className="text-sm text-red-600 font-medium">
                  {error}
                </p>
              )}

              {/* BUTTON */}
              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90"
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

            {/* REGISTER */}
            <div className="mt-6 text-center text-sm">

              <span className="text-muted-foreground">
                Don&apos;t have an account?{' '}
              </span>

              <Link
                href="/auth/admin/register"
                className="text-accent hover:underline font-medium"
              >
                Register here
              </Link>

            </div>

          </CardContent>
        </Card>

        {/* LOGO */}
        <div className="mt-8 flex justify-center">
          <Logo size="sm" />
        </div>

      </div>
    </div>
  )
}