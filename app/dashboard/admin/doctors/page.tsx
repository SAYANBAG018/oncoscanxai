// app/dashboard/admin/doctors/page.tsx

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
  Stethoscope,
  Search,
  Plus,
  Mail,
  Phone,
  Users,
  ArrowRight,
} from 'lucide-react'

export default function AdminDoctorsPage() {
  const { doctors } = useStore()

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Doctors Management</h1>
            <p className="text-muted-foreground">
              View and manage all registered doctors
            </p>
          </div>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Doctor
          </Button>
        </div>

        {/* Search + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card className="lg:col-span-3">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctors by name or specialization..."
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Stethoscope className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{doctors.length}</p>
              <p className="text-sm text-muted-foreground">
                Total Doctors
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Doctors List */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Doctors</CardTitle>
            <CardDescription>
              All doctors available in the system
            </CardDescription>
          </CardHeader>

          <CardContent>
            {doctors.length === 0 ? (
              <div className="text-center py-12">
                <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">
                  No Doctors Found
                </h3>
                <p className="text-muted-foreground mb-4">
                  No doctors have been registered yet.
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Doctor
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    {/* Doctor Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Stethoscope className="h-6 w-6 text-primary" />
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {doctor.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {doctor.email}
                        </div>
                      )}

                      {doctor.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {doctor.phone}
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="text-center">
                      <p className="text-xl font-bold">
                        {doctor.patientsCount || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Patients
                      </p>
                    </div>

                    {/* Action */}
                    <Button variant="outline" size="sm">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Stethoscope className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">
                {doctors.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Registered Doctors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">
                {doctors.reduce(
                  (sum, doc) => sum + (doc.patientsCount || 0),
                  0
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                Total Patients Assigned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Search className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">
                {doctors.filter(
                  (doc) => (doc.patientsCount || 0) > 0
                ).length}
              </p>
              <p className="text-sm text-muted-foreground">
                Active Doctors
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}