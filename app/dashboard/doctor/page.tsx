'use client'

import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStore, Patient } from '@/lib/store'
import { 
  Users, 
  FileSearch, 
  TrendingUp, 
  Clock,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Brain
} from 'lucide-react'
import Link from 'next/link'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts'

export default function DoctorDashboard() {
  const { patients, currentUser } = useStore()
  
  const doctorPatients = patients.filter(p => p.doctorId === currentUser?.id || currentUser?.id === 'd1')
  
  const totalPatients = doctorPatients.length
  const totalScans = doctorPatients.length
  const positiveCount = doctorPatients.filter(p => p.status === 'positive').length
  const negativeCount = doctorPatients.filter(p => p.status === 'negative').length
  const pendingCount = doctorPatients.filter(p => p.status === 'pending').length
  const inconclusiveCount = doctorPatients.filter(p => p.status === 'inconclusive').length
  
  const positiveRatio = totalPatients > 0 ? ((positiveCount / totalPatients) * 100).toFixed(1) : 0

  // MRI scan data for chart
  const scanData = [
    { month: 'Jan', scans: 12, positive: 2 },
    { month: 'Feb', scans: 19, positive: 4 },
    { month: 'Mar', scans: 15, positive: 3 },
    { month: 'Apr', scans: 22, positive: 5 },
    { month: 'May', scans: 28, positive: 6 },
  ]

  const statusData = [
    { name: 'Negative', value: negativeCount, color: 'oklch(0.6 0.2 145)' },
    { name: 'Positive', value: positiveCount, color: 'oklch(0.55 0.22 25)' },
    { name: 'Pending', value: pendingCount, color: 'oklch(0.75 0.18 85)' },
    { name: 'Inconclusive', value: inconclusiveCount, color: 'oklch(0.5 0.02 280)' },
  ]

  const recentScans = doctorPatients.slice(0, 5)

  const getStatusIcon = (status: Patient['status']) => {
    switch (status) {
      case 'positive':
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case 'negative':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'inconclusive':
        return <HelpCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: Patient['status']) => {
    const styles = {
      positive: 'bg-destructive/10 text-destructive',
      negative: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      inconclusive: 'bg-muted text-muted-foreground'
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${styles[status]}`}>
        {getStatusIcon(status)}
        {status}
      </span>
    )
  }

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {currentUser?.name}</p>
          </div>
          <Link href="/dashboard/doctor/patients/new">
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Add New Patient
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalPatients}</div>
              <p className="text-xs text-muted-foreground mt-1">+2 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Scans</CardTitle>
              <FileSearch className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalScans}</div>
              <p className="text-xs text-muted-foreground mt-1">MRI & Mammograms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Positive Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{positiveRatio}%</div>
              <p className="text-xs text-muted-foreground mt-1">{positiveCount} positive cases</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Analysis</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting AI review</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* MRI Scans Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Scan Analysis Trend</CardTitle>
              <CardDescription>Monthly scan and positive detection rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scanData}>
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
                    <Line 
                      type="monotone" 
                      dataKey="scans" 
                      stroke="oklch(0.55 0.25 280)" 
                      strokeWidth={2}
                      dot={{ fill: 'oklch(0.55 0.25 280)' }}
                      name="Total Scans"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="positive" 
                      stroke="oklch(0.55 0.22 25)" 
                      strokeWidth={2}
                      dot={{ fill: 'oklch(0.55 0.22 25)' }}
                      name="Positive Cases"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Status Distribution</CardTitle>
              <CardDescription>Breakdown of diagnosis results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'oklch(1 0 0)', 
                        border: '1px solid oklch(0.9 0.01 280)',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans & AI Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Scans List */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>Latest patient scans and analysis</CardDescription>
              </div>
              <Link href="/dashboard/doctor/patients">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentScans.map((patient) => (
                  <Link 
                    key={patient.id} 
                    href={`/dashboard/doctor/patients/${patient.id}`}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.scanType} • {patient.scanDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(patient.status)}
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Analysis
              </CardTitle>
              <CardDescription>Latest AI findings overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-destructive">High Priority</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {positiveCount} patient{positiveCount !== 1 ? 's' : ''} require{positiveCount === 1 ? 's' : ''} immediate attention
                </p>
              </div>

              <div className="p-4 rounded-lg bg-yellow-100/50 border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-yellow-700" />
                  <span className="font-medium text-yellow-700">Awaiting Review</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {pendingCount} scan{pendingCount !== 1 ? 's' : ''} pending AI analysis
                </p>
              </div>

              <div className="p-4 rounded-lg bg-green-100/50 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-700" />
                  <span className="font-medium text-green-700">Clear Results</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {negativeCount} patient{negativeCount !== 1 ? 's' : ''} with negative results
                </p>
              </div>

              <Link href="/dashboard/doctor/analysis">
                <Button variant="outline" className="w-full mt-2">
                  View Full Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
