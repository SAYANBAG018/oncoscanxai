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

import { useStore } from '@/lib/store'

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle,
  Clock,
  Cpu,
  Download,
  FileSearch,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'

export default function AdminAnalyticsPage() {

  const { patients, doctors } = useStore()

  const totalScans = patients.length

  const positiveCases = patients.filter(
    (p) => p.status === 'positive'
  ).length

  const negativeCases = patients.filter(
    (p) => p.status === 'negative'
  ).length

  const pendingCases = patients.filter(
    (p) => p.status === 'pending'
  ).length

  const positiveRate =
    totalScans > 0
      ? ((positiveCases / totalScans) * 100).toFixed(1)
      : 0

  /* =========================
     Monthly Trend Data
  ========================= */

  const monthlyData = [
    { month: 'Jan', scans: 120, positive: 20 },
    { month: 'Feb', scans: 180, positive: 35 },
    { month: 'Mar', scans: 240, positive: 40 },
    { month: 'Apr', scans: 310, positive: 58 },
    { month: 'May', scans: 390, positive: 65 },
    { month: 'Jun', scans: 470, positive: 82 },
  ]

  /* =========================
     Pie Chart
  ========================= */

  const resultDistribution = [
    {
      name: 'Positive',
      value: positiveCases,
      color: '#ef4444',
    },

    {
      name: 'Negative',
      value: negativeCases,
      color: '#22c55e',
    },

    {
      name: 'Pending',
      value: pendingCases,
      color: '#eab308',
    },
  ]

  /* =========================
     Doctor Performance
  ========================= */

  const doctorPerformance = doctors.map((doctor) => ({
    name: doctor.name.split(' ').slice(-1)[0],
    patients: doctor.patientsCount || 0,
  }))

  /* =========================
     Scan Type Distribution
  ========================= */

  const scanTypeData = [
    {
      name: 'MRI',
      value: patients.filter(
        (p) => p.scanType === 'MRI'
      ).length,
    },

    {
      name: 'Mammogram',
      value: patients.filter(
        (p) => p.scanType === 'Mammogram'
      ).length,
    },

    {
      name: 'Both',
      value: patients.filter(
        (p) => p.scanType === 'Both'
      ).length,
    },
  ]

  return (
    <DashboardLayout role="admin">

      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <h1 className="text-2xl font-bold">
              Analytics Dashboard
            </h1>

            <p className="text-muted-foreground">
              AI insights, scan analytics and system performance
            </p>
          </div>

          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Analytics
          </Button>

        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm text-muted-foreground">
                Total Scans
              </CardTitle>

              <FileSearch className="h-5 w-5 text-primary" />

            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold">
                {totalScans}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Overall scans processed
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm text-muted-foreground">
                Positive Rate
              </CardTitle>

              <AlertTriangle className="h-5 w-5 text-red-600" />

            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {positiveRate}%
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Positive detections
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm text-muted-foreground">
                AI Accuracy
              </CardTitle>

              <Brain className="h-5 w-5 text-green-600" />

            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                96.4%
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Average AI confidence
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm text-muted-foreground">
                Avg Processing Time
              </CardTitle>

              <Clock className="h-5 w-5 text-primary" />

            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold">
                2.3s
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Average scan analysis
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Monthly Trends */}
          <Card>

            <CardHeader>
              <CardTitle>
                Monthly Scan Trends
              </CardTitle>

              <CardDescription>
                Growth in scans and positive detections
              </CardDescription>
            </CardHeader>

            <CardContent>

              <div className="h-80">

                <ResponsiveContainer width="100%" height="100%">

                  <AreaChart data={monthlyData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="scans"
                      stroke="#8b5cf6"
                      fill="#8b5cf620"
                      strokeWidth={3}
                    />

                    <Area
                      type="monotone"
                      dataKey="positive"
                      stroke="#ef4444"
                      fill="#ef444420"
                      strokeWidth={3}
                    />

                  </AreaChart>

                </ResponsiveContainer>

              </div>

            </CardContent>
          </Card>

          {/* Results Distribution */}
          <Card>

            <CardHeader>
              <CardTitle>
                Scan Results Distribution
              </CardTitle>

              <CardDescription>
                Positive vs negative vs pending
              </CardDescription>
            </CardHeader>

            <CardContent>

              <div className="h-80">

                <ResponsiveContainer width="100%" height="100%">

                  <PieChart>

                    <Pie
                      data={resultDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label
                    >

                      {resultDistribution.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.color}
                        />
                      ))}

                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </CardContent>
          </Card>

        </div>

        {/* Second Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Doctor Performance */}
          <Card>

            <CardHeader>
              <CardTitle>
                Doctor Performance
              </CardTitle>

              <CardDescription>
                Patients handled per doctor
              </CardDescription>
            </CardHeader>

            <CardContent>

              <div className="h-80">

                <ResponsiveContainer width="100%" height="100%">

                  <BarChart data={doctorPerformance}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="patients"
                      fill="#8b5cf6"
                      radius={[6, 6, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </CardContent>
          </Card>

          {/* Scan Type */}
          <Card>

            <CardHeader>
              <CardTitle>
                Scan Type Distribution
              </CardTitle>

              <CardDescription>
                MRI vs Mammogram vs Combined
              </CardDescription>
            </CardHeader>

            <CardContent>

              <div className="space-y-6">

                {scanTypeData.map((scan) => (

                  <div key={scan.name}>

                    <div className="flex items-center justify-between mb-2">

                      <p className="font-medium">
                        {scan.name}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {scan.value}
                      </p>

                    </div>

                    <div className="w-full bg-muted rounded-full h-3">

                      <div
                        className="bg-primary h-3 rounded-full"
                        style={{
                          width: `${totalScans > 0
                            ? (scan.value / totalScans) * 100
                            : 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                ))}

              </div>

            </CardContent>
          </Card>

        </div>

        {/* Bottom Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Card>
            <CardContent className="pt-6 text-center">

              <Cpu className="h-8 w-8 mx-auto text-primary mb-2" />

              <p className="text-2xl font-bold">
                99.9%
              </p>

              <p className="text-sm text-muted-foreground">
                AI Uptime
              </p>

            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">

              <Shield className="h-8 w-8 mx-auto text-green-600 mb-2" />

              <p className="text-2xl font-bold">
                Secure
              </p>

              <p className="text-sm text-muted-foreground">
                System Security Status
              </p>

            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">

              <TrendingUp className="h-8 w-8 mx-auto text-accent mb-2" />

              <p className="text-2xl font-bold">
                +24%
              </p>

              <p className="text-sm text-muted-foreground">
                Monthly Growth
              </p>

            </CardContent>
          </Card>

        </div>

      </div>

    </DashboardLayout>
  )
}