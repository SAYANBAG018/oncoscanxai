'use client'

import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStore, Patient } from '@/lib/store'
import { 
  Users, 
  Stethoscope, 
  FileSearch, 
  TrendingUp,
  Activity,
  Server,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  BarChart3,
  Globe,
  Cpu,
  Database,
  Zap,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export default function AdminDashboard() {
  const { patients, doctors, currentUser } = useStore()
  
  const totalPatients = patients.length
  const totalDoctors = doctors.length
  const totalScans = patients.length
  const positiveCount = patients.filter(p => p.status === 'positive').length
  const negativeCount = patients.filter(p => p.status === 'negative').length
  const pendingCount = patients.filter(p => p.status === 'pending').length

  // System metrics
  const systemMetrics = {
    aiUptime: 99.97,
    avgProcessingTime: 2.3,
    scansToday: 47,
    activeUsers: 12
  }

  // Monthly analytics data
  const monthlyData = [
    { month: 'Jan', scans: 145, doctors: 8, patients: 120 },
    { month: 'Feb', scans: 189, doctors: 10, patients: 156 },
    { month: 'Mar', scans: 234, doctors: 12, patients: 198 },
    { month: 'Apr', scans: 278, doctors: 14, patients: 245 },
    { month: 'May', scans: 312, doctors: 15, patients: 289 },
  ]

  // Scan type distribution
  const scanTypeData = [
    { name: 'Mammogram', value: 65, color: 'oklch(0.55 0.25 280)' },
    { name: 'MRI', value: 28, color: 'oklch(0.65 0.2 340)' },
    { name: 'Both', value: 7, color: 'oklch(0.6 0.2 145)' },
  ]

  // Doctor performance
  const doctorPerformance = doctors.map(doc => ({
    name: doc.name.split(' ').slice(-1)[0],
    patients: doc.patientsCount,
    fullName: doc.name
  }))

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Doctor
            </Button>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Doctors</CardTitle>
              <Stethoscope className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalDoctors}</div>
              <p className="text-xs text-muted-foreground mt-1">+3 this month</p>
            </CardContent>
          </Card>

          <Card className="bg-accent/5 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
              <Users className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalPatients}</div>
              <p className="text-xs text-muted-foreground mt-1">+15 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Scans</CardTitle>
              <FileSearch className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalScans}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Detection Rate</CardTitle>
              <TrendingUp className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {totalPatients > 0 ? ((positiveCount / totalPatients) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">{positiveCount} positive cases</p>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI System Uptime</p>
                  <p className="text-2xl font-bold text-green-700">{systemMetrics.aiUptime}%</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Processing Time</p>
                  <p className="text-2xl font-bold">{systemMetrics.avgProcessingTime}s</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scans Today</p>
                  <p className="text-2xl font-bold">{systemMetrics.scansToday}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{systemMetrics.activeUsers}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Globe className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Growth</CardTitle>
              <CardDescription>Monthly scans and patient registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 280)" />
                    <XAxis dataKey="month" stroke="oklch(0.5 0.02 280)" fontSize={12} />
                    <YAxis stroke="oklch(0.5 0.02 280)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'oklch(1 0 0)', 
                        border: '1px solid oklch(0.9 0.01 280)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="scans" 
                      stroke="oklch(0.55 0.25 280)" 
                      fill="oklch(0.55 0.25 280 / 0.2)"
                      strokeWidth={2}
                      name="Total Scans"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="patients" 
                      stroke="oklch(0.65 0.2 340)" 
                      fill="oklch(0.65 0.2 340 / 0.2)"
                      strokeWidth={2}
                      name="Patients"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Scan Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Scan Type Distribution</CardTitle>
              <CardDescription>Breakdown by imaging modality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scanTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {scanTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doctor Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Registered Doctors</CardTitle>
                <CardDescription>Active medical professionals</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <div 
                    key={doctor.id} 
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{doctor.patientsCount}</p>
                      <p className="text-xs text-muted-foreground">patients</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system events</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">New doctor registered</p>
                    <p className="text-xs text-muted-foreground">Dr. Amanda Roberts joined the platform</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <FileSearch className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">AI Analysis Complete</p>
                    <p className="text-xs text-muted-foreground">47 scans processed today</p>
                    <p className="text-xs text-muted-foreground mt-1">30 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">High-risk case flagged</p>
                    <p className="text-xs text-muted-foreground">Patient requires urgent review</p>
                    <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg border border-border">
                  <Server className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">System Update</p>
                    <p className="text-xs text-muted-foreground">AI model updated to v2.4</p>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                <Stethoscope className="h-6 w-6" />
                <span>Manage Doctors</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>View Patients</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                <Database className="h-6 w-6" />
                <span>System Logs</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                <Shield className="h-6 w-6" />
                <span>Security Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
