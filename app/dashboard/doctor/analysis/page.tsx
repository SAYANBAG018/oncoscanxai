'use client'

import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStore, Patient } from '@/lib/store'
import { 
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  HelpCircle,
  ArrowRight,
  Activity,
  TrendingUp,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function AnalysisPage() {
  const { patients, currentUser } = useStore()
  
  const doctorPatients = patients.filter(p => p.doctorId === currentUser?.id || currentUser?.id === 'd1')
  const analyzedPatients = doctorPatients.filter(p => p.aiAnalysis)
  
  const avgConfidence = analyzedPatients.length > 0
    ? (analyzedPatients.reduce((acc, p) => acc + (p.aiAnalysis?.confidence || 0), 0) / analyzedPatients.length).toFixed(1)
    : 0

  const riskDistribution = [
    { risk: 'Low', count: analyzedPatients.filter(p => p.aiAnalysis?.riskLevel === 'low').length, color: 'oklch(0.6 0.2 145)' },
    { risk: 'Moderate', count: analyzedPatients.filter(p => p.aiAnalysis?.riskLevel === 'moderate').length, color: 'oklch(0.75 0.18 85)' },
    { risk: 'High', count: analyzedPatients.filter(p => p.aiAnalysis?.riskLevel === 'high').length, color: 'oklch(0.55 0.22 25)' },
  ]

  const getStatusIcon = (status: Patient['status']) => {
    switch (status) {
      case 'positive':
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case 'negative':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'inconclusive':
        return <HelpCircle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getRiskBadge = (risk?: 'low' | 'moderate' | 'high') => {
    const styles = {
      low: 'bg-green-100 text-green-700 border-green-200',
      moderate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      high: 'bg-destructive/10 text-destructive border-destructive/20'
    }
    return risk ? (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${styles[risk]}`}>
        <Shield className="h-3 w-3" />
        {risk}
      </span>
    ) : null
  }

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">AI Analysis Overview</h1>
          <p className="text-muted-foreground">Review AI-powered scan analysis results</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Analyzed Scans</p>
                  <p className="text-3xl font-bold">{analyzedPatients.length}</p>
                </div>
                <Brain className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                  <p className="text-3xl font-bold">{avgConfidence}%</p>
                </div>
                <Activity className="h-10 w-10 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Risk Cases</p>
                  <p className="text-3xl font-bold">{riskDistribution[2].count}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-destructive/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
            <CardDescription>Breakdown of AI risk assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 280)" />
                  <XAxis dataKey="risk" stroke="oklch(0.5 0.02 280)" />
                  <YAxis stroke="oklch(0.5 0.02 280)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'oklch(1 0 0)', 
                      border: '1px solid oklch(0.9 0.01 280)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="oklch(0.55 0.25 280)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent AI Analysis Results</CardTitle>
            <CardDescription>Detailed findings from AI scan analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyzedPatients.map((patient) => (
                <Link 
                  key={patient.id}
                  href={`/dashboard/doctor/patients/${patient.id}`}
                  className="block"
                >
                  <div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-medium text-primary">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{patient.name}</h3>
                            {getStatusIcon(patient.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {patient.scanType} • {patient.scanDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {patient.aiAnalysis && (
                          <>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Confidence</p>
                              <p className="font-bold">{patient.aiAnalysis.confidence}%</p>
                            </div>
                            {getRiskBadge(patient.aiAnalysis.riskLevel)}
                          </>
                        )}
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>

                    {patient.aiAnalysis && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm font-medium mb-2">Key Findings:</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {patient.aiAnalysis.findings.slice(0, 3).map((finding, index) => (
                            <li key={index} className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Link>
              ))}

              {analyzedPatients.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No analyzed scans yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
