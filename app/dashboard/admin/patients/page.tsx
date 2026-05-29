'use client'

import { DashboardLayout } from '@/components/dashboard-layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@/lib/store'

import {
  Users,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  UserCheck,
  Bell,
  Activity,
  FileSearch,
} from 'lucide-react'

export default function AdminPatientsPage() {
  const { patients, doctors } = useStore()

  const totalPatients = patients.length

  const positiveCases = patients.filter(
    (p) => p.status === 'positive'
  ).length

  const pendingCases = patients.filter(
    (p) => p.status === 'pending'
  ).length

  const negativeCases = patients.filter(
    (p) => p.status === 'negative'
  ).length

  const emergencyCases = patients.filter(
  (p) => p.aiAnalysis?.riskLevel === 'high'
  ).length

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Patients Management
            </h1>

            <p className="text-muted-foreground">
              Manage patients, reports and consultations
            </p>
          </div>

          <Button>
            <Users className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Patients
              </CardTitle>

              <Users className="h-5 w-5 text-primary" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold">
                {totalPatients}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Registered patients
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Positive Cases
              </CardTitle>

              <AlertTriangle className="h-5 w-5 text-red-600" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {positiveCases}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                High-risk detections
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Pending Reviews
              </CardTitle>

              <Clock className="h-5 w-5 text-yellow-600" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {pendingCases}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Waiting for review
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Emergency Cases
              </CardTitle>

              <Activity className="h-5 w-5 text-green-600" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {emergencyCases}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Immediate attention required
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search + Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">

              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                  placeholder="Search patient by name, ID or doctor..."
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">

                <Button variant="outline">
                  All
                </Button>

                <Button variant="outline">
                  Positive
                </Button>

                <Button variant="outline">
                  Negative
                </Button>

                <Button variant="outline">
                  Pending
                </Button>

                <Button variant="outline">
                  Emergency
                </Button>

              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        <Card>

          <CardHeader>
            <CardTitle>
              Patients Overview
            </CardTitle>

            <CardDescription>
              Complete patient records and AI scan status
            </CardDescription>
          </CardHeader>

          <CardContent>

            {patients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />

                <h3 className="text-lg font-semibold">
                  No Patients Found
                </h3>

                <p className="text-muted-foreground">
                  No patient records available
                </p>
              </div>
            ) : (
              <div className="space-y-4">

                {patients.map((patient) => {

                  const assignedDoctor =
                    doctors.find(
                      (doc) => doc.id === patient.doctorId
                    )?.name || 'Not Assigned'

                  return (
                    <div
                      key={patient.id}
                      className="border rounded-xl p-5 hover:bg-muted/40 transition-colors"
                    >

                      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                        {/* Patient Info */}
                        <div className="space-y-2">

                          <div>
                            <h3 className="text-lg font-semibold">
                              {patient.name}
                            </h3>

                            <p className="text-sm text-muted-foreground">
                              Patient ID: {patient.id}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">

                            <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                              {patient.scanType || 'Mammogram'}
                            </span>

                            <span className="px-3 py-1 rounded-full text-xs bg-muted">
                              {patient.status}
                            </span>

                            {patient.aiAnalysis?.riskLevel === 'high' && (
                              <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">
                                Emergency
                              </span>
                            )}

                          </div>

                        </div>

                        {/* Doctor */}
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Assigned Doctor
                          </p>

                          <p className="font-medium">
                            {assignedDoctor}
                          </p>
                        </div>

                        {/* AI Result */}
                        <div>
                          <p className="text-sm text-muted-foreground">
                            AI Confidence
                          </p>

                          <p className="font-bold text-lg">
                            {patient.aiAnalysis?.confidence || 87}%
                          </p>
                        </div>

                        {/* Consultation */}
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Consultation
                          </p>

                          <div className="flex items-center gap-2 text-green-600 font-medium">
                            <UserCheck className="h-4 w-4" />
                            Doctor Consulted
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">

                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Report
                          </Button>

                          <Button variant="outline" size="sm">
                            <Bell className="h-4 w-4 mr-2" />
                            Notify Doctor
                          </Button>

                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>

                        </div>

                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />

              <p className="text-2xl font-bold">
                {negativeCases}
              </p>

              <p className="text-sm text-muted-foreground">
                Negative Reports
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <FileSearch className="h-8 w-8 mx-auto text-primary mb-2" />

              <p className="text-2xl font-bold">
                {patients.length}
              </p>

              <p className="text-sm text-muted-foreground">
                Total AI Reports
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <UserCheck className="h-8 w-8 mx-auto text-accent mb-2" />

              <p className="text-2xl font-bold">
                {doctors.length}
              </p>

              <p className="text-sm text-muted-foreground">
                Doctors Available
              </p>
            </CardContent>
          </Card>

        </div>

      </div>
    </DashboardLayout>
  )
}