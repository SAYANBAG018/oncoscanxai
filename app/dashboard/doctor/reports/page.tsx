'use client'

import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { 
  FileText, 
  Download, 
  Calendar,
  BarChart3,
  Users,
  TrendingUp
} from 'lucide-react'

export default function ReportsPage() {
  const { patients, currentUser } = useStore()
  
  const doctorPatients = patients.filter(p => p.doctorId === currentUser?.id || currentUser?.id === 'd1')

  const reports = [
    {
      title: 'Monthly Summary Report',
      description: 'Overview of all scans and analysis for the current month',
      date: 'May 2026',
      icon: Calendar
    },
    {
      title: 'Patient Statistics',
      description: 'Comprehensive patient demographics and outcomes',
      date: 'Generated on demand',
      icon: Users
    },
    {
      title: 'AI Performance Report',
      description: 'Analysis accuracy and confidence metrics',
      date: 'Weekly report',
      icon: BarChart3
    },
    {
      title: 'Trend Analysis',
      description: 'Historical trends in detection rates',
      date: 'Quarterly report',
      icon: TrendingUp
    }
  ]

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and download analysis reports</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{doctorPatients.length}</p>
              <p className="text-sm text-muted-foreground">Total Patients</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">
                {doctorPatients.filter(p => p.aiAnalysis).length}
              </p>
              <p className="text-sm text-muted-foreground">Analyzed Scans</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-destructive">
                {doctorPatients.filter(p => p.status === 'positive').length}
              </p>
              <p className="text-sm text-muted-foreground">Positive Cases</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>Download or generate reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <report.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{report.date}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Custom Report
            </CardTitle>
            <CardDescription>Generate a custom report with specific parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Create custom reports with date ranges and filters
              </p>
              <Button>
                Create Custom Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
