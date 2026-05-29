'use client'

import { useEffect, useState } from 'react'

import { DashboardLayout } from '@/components/dashboard-layout'

import { Card, CardContent } from '@/components/ui/card'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

import { useStore, Patient } from '@/lib/store'

import {
  Search,
  Plus,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  HelpCircle,
  Users,
  SortAsc
} from 'lucide-react'

import Link from 'next/link'

import {
  collection,
  query,
  where,
  onSnapshot
} from 'firebase/firestore'

import { db } from '@/lib/firebase'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function PatientsListPage() {

  const { currentUser } = useStore()

  const [patients, setPatients] = useState<any[]>([])

  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')

  const [statusFilter, setStatusFilter] = useState<string>('all')

  const [scanTypeFilter, setScanTypeFilter] = useState<string>('all')

  // =========================
  // FETCH FIRESTORE PATIENTS
  // =========================

  useEffect(() => {

  setLoading(true)

  let q

  // Base query
  if (
    currentUser?.id &&
    currentUser.id !== 'd1'
  ) {
    q = query(
      collection(db, 'patients'),
      where('doctorId', '==', currentUser.id)
    )
  } else {
    q = query(collection(db, 'patients'))
  }

  // Real-time listener
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {

      const patientsData = snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      )

      setPatients(patientsData)

      setLoading(false)
    },
    (error) => {

      console.error(
        'Realtime fetch error:',
        error
      )

      setLoading(false)
    }
  )

  return () => unsubscribe()

}, [currentUser])

  // =========================
  // FILTER PATIENTS
  // =========================

 
const filteredPatients = patients.filter(
  (patient) => {

    const search =
      searchQuery.toLowerCase().trim()

    const matchesSearch =
      patient.name
        ?.toLowerCase()
        .includes(search) ||

      patient.disease
        ?.toLowerCase()
        .includes(search) ||

      patient.scanType
        ?.toLowerCase()
        .includes(search)

    const matchesStatus =
      statusFilter === 'all' ||
      patient.status === statusFilter

    const matchesScanType =
      scanTypeFilter === 'all' ||
      patient.scanType === scanTypeFilter

    return (
      matchesSearch &&
      matchesStatus &&
      matchesScanType
    )
  }
)

  // =========================
  // STATUS ICON
  // =========================

  const getStatusIcon = (status: Patient['status']) => {

    switch (status) {

      case 'positive':
        return (
          <AlertTriangle className="h-4 w-4 text-destructive" />
        )

      case 'negative':
        return (
          <CheckCircle className="h-4 w-4 text-green-600" />
        )

      case 'pending':
        return (
          <Clock className="h-4 w-4 text-yellow-600" />
        )

      case 'inconclusive':
        return (
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        )
    }
  }

  // =========================
  // STATUS BADGE
  // =========================

  const getStatusBadge = (status: Patient['status']) => {

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

    return (

      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${styles[status]}`}
      >

        {getStatusIcon(status)}

        {status}

      </span>
    )
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <DashboardLayout role="doctor">

        <div className="p-10 text-center">

          Loading patients...

        </div>

      </DashboardLayout>
    )
  }

  return (

    <DashboardLayout role="doctor">

      <div className="space-y-6">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>

            <h1 className="text-2xl font-bold">
              Patients
            </h1>

            <p className="text-muted-foreground">
              Manage your patient records and scan results
            </p>

          </div>

          <Link href="/dashboard/doctor/patients/new">

            <Button>

              <Plus className="mr-2 h-4 w-4" />

              Add New Patient

            </Button>

          </Link>

        </div>

        {/* FILTERS */}

        <Card>

          <CardContent className="pt-6">

            <div className="flex flex-col sm:flex-row gap-4">

              {/* SEARCH */}

              <div className="relative flex-1">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                  placeholder="Search patients by name or condition..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="pl-10"
                />

              </div>

              {/* STATUS FILTER */}

              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >

                <SelectTrigger className="w-full sm:w-40">

                  <Filter className="h-4 w-4 mr-2" />

                  <SelectValue placeholder="Status" />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="all">
                    All Status
                  </SelectItem>

                  <SelectItem value="positive">
                    Positive
                  </SelectItem>

                  <SelectItem value="negative">
                    Negative
                  </SelectItem>

                  <SelectItem value="pending">
                    Pending
                  </SelectItem>

                  <SelectItem value="inconclusive">
                    Inconclusive
                  </SelectItem>

                </SelectContent>

              </Select>

              {/* SCAN TYPE FILTER */}

              <Select
                value={scanTypeFilter}
                onValueChange={setScanTypeFilter}
              >

                <SelectTrigger className="w-full sm:w-40">

                  <SortAsc className="h-4 w-4 mr-2" />

                  <SelectValue placeholder="Scan Type" />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="all">
                    All Types
                  </SelectItem>

                  <SelectItem value="MRI">
                    MRI
                  </SelectItem>

                  <SelectItem value="Mammogram">
                    Mammogram
                  </SelectItem>

                  <SelectItem value="Both">
                    Both
                  </SelectItem>

                </SelectContent>

              </Select>

            </div>

          </CardContent>

        </Card>

        {/* RESULTS COUNT */}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">

          <Users className="h-4 w-4" />

          <span>

            Showing {filteredPatients.length} of {patients.length} patients
          </span>

        </div>

        {/* PATIENT LIST */}

        {filteredPatients.length > 0 ? (

          <div className="grid gap-4">

            {filteredPatients.map((patient) => (

              <Card
                key={patient.patientUniqueId}
                className="hover:shadow-lg transition-all duration-200"
              >

                <CardContent className="pt-6">

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    {/* LEFT */}

                    <div className="space-y-2">

                      <h3 className="text-lg font-semibold">
                        {patient.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">

                        <p>
                          <span className="font-medium text-foreground">
                            Age:
                          </span>{' '}
                          {patient.age}
                        </p>

                        <p>
                          <span className="font-medium text-foreground">
                            Gender:
                          </span>{' '}
                          {patient.gender}
                        </p>

                        <p>
                          <span className="font-medium text-foreground">
                            Scan:
                          </span>{' '}
                          {patient.scanType}
                        </p>

                      </div>

                    </div>

                    {/* RIGHT */}

                    <div className="flex flex-wrap items-center gap-4">

                      {getStatusBadge(patient.status)}

                      <Link
  href={`/dashboard/doctor/patients/${patient.id}`}
>

                        <Button size="sm">

                          View More

                        </Button>

                      </Link>

                    </div>

                  </div>

                </CardContent>

              </Card>

            ))}

          </div>

        ) : (

          <Card>

            <CardContent className="py-12 text-center">

              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />

              <h3 className="text-lg font-medium mb-2">
                No patients found
              </h3>

              <p className="text-muted-foreground mb-4">

                {searchQuery ||
                statusFilter !== 'all' ||
                scanTypeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start by adding your first patient'}

              </p>

              <Link href="/dashboard/doctor/patients/new">

                <Button>

                  <Plus className="mr-2 h-4 w-4" />

                  Add New Patient

                </Button>

              </Link>

            </CardContent>

          </Card>

        )}

      </div>

    </DashboardLayout>
  )
}