'use client'

import { useEffect, useState } from 'react'

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  onSnapshot
} from 'firebase/firestore'

import { db } from '@/lib/firebase'

import { DashboardLayout } from '@/components/dashboard-layout'

import { Card, CardContent } from '@/components/ui/card'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

import { Textarea } from '@/components/ui/textarea'

export default function FeedbackPage() {

  const [patientId, setPatientId] =
    useState('')

  const [patient, setPatient] =
    useState<any>(null)

  const [feedback, setFeedback] =
    useState('')

  const [allFeedbacks, setAllFeedbacks] =
    useState<any[]>([])

  // SEARCH PATIENT
  const handleSearch = async () => {

    if (!patientId) return

    const q = query(
      collection(db, 'patients'),
     where(
  'patientUniqueId',
  '==',
  patientId.toUpperCase()
)
    )

    const snapshot = await getDocs(q)

    if (!snapshot.empty) {

      setPatient(snapshot.docs[0].data())

    } else {

      alert('Patient not found')

      setPatient(null)
    }
  }

  // SUBMIT FEEDBACK
  const handleSubmit = async () => {

    if (!patient || !feedback) return

    await addDoc(
      collection(db, 'feedbacks'),
      {
        patientId: patient.id,

        patientName: patient.name,

        aiClassification:
          patient.status,

        riskLevel:
          patient.aiAnalysis?.riskLevel,

        feedback,

        status: 'pending',

        createdAt: serverTimestamp()
      }
    )

    setFeedback('')

    alert('Feedback submitted')
  }

  // REALTIME FEEDBACKS
  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, 'feedbacks'),
      (snapshot) => {

        const data = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data()
          })
        )

        setAllFeedbacks(data)
      }
    )

    return () => unsubscribe()

  }, [])

  return (

    <DashboardLayout role="doctor">

      <div className="space-y-6">

        <h1 className="text-2xl font-bold">
          Doctor Feedback
        </h1>

        {/* SEARCH */}

        <Card>

          <CardContent className="pt-6 space-y-4">

            <Input
              placeholder="Enter Patient ID"
              value={patientId}
              onChange={(e) =>
                setPatientId(e.target.value)
              }
            />

            <Button onClick={handleSearch}>
              Search Patient
            </Button>

          </CardContent>

        </Card>

        {/* PATIENT DETAILS */}

        {patient && (

          <Card>

            <CardContent className="pt-6 space-y-4">

              <h2 className="text-xl font-bold">
                {patient.name}
              </h2>

              <p>
                Patient ID: {patient.id}
              </p>

              <p>
                Classification:
                {' '}
                {patient.status}
              </p>

              <p>
                Risk Level:
                {' '}
                {patient.aiAnalysis?.riskLevel}
              </p>

              <Textarea
                placeholder="Write feedback..."
                value={feedback}
                onChange={(e) =>
                  setFeedback(e.target.value)
                }
              />

              <Button onClick={handleSubmit}>
                Submit Feedback
              </Button>

            </CardContent>

          </Card>

        )}

        {/* ALL FEEDBACKS */}

        <div className="space-y-4">

          {allFeedbacks.map((item) => (

            <Card key={item.id}>

              <CardContent className="pt-6 space-y-2">

                <p>
                  <strong>Patient:</strong>
                  {' '}
                  {item.patientName}
                </p>

                <p>
                  <strong>ID:</strong>
                  {' '}
                  {item.patientId}
                </p>

                <p>
                  <strong>Classification:</strong>
                  {' '}
                  {item.aiClassification}
                </p>

                <p>
                  <strong>Risk:</strong>
                  {' '}
                  {item.riskLevel}
                </p>

                <p>
                  <strong>Feedback:</strong>
                  {' '}
                  {item.feedback}
                </p>

                <p>
                  <strong>Status:</strong>
                  {' '}
                  {item.status}
                </p>

              </CardContent>

            </Card>

          ))}

        </div>

      </div>

    </DashboardLayout>
  )
}