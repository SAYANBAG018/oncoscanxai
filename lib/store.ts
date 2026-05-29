import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Patient {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  disease: string
  scanType: 'MRI' | 'Mammogram' | 'Both'
  scanImage?: string
  scanDate: string
  status: 'pending' | 'positive' | 'negative' | 'inconclusive'
  aiAnalysis?: {
    confidence: number
    findings: string[]
    recommendation: string
    riskLevel: 'low' | 'moderate' | 'high'
  }
  doctorId: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'doctor' | 'admin' | 'guest'
  specialization?: string
}
export interface Doctor {
  id: string
  name: string
  email: string
  role: string
  specialization: string
  patientsCount: number
  phone?: string
}

interface AppState {
  currentUser: User | null
  patients: Patient[]
  doctors: Doctor[]
  isAuthenticated: boolean
  guestPatientId: string | null
  
  // Actions
  login: (user: User) => void
  logout: () => void
  addPatient: (patient: Patient) => void
  updatePatient: (id: string, updates: Partial<Patient>) => void
  deletePatient: (id: string) => void
  addDoctor: (doctor: Doctor) => void
  setGuestPatientId: (id: string | null) => void
  getPatientById: (id: string) => Patient | undefined
}

// Sample data for demo
const samplePatients: Patient[] = [
  {
    id: 'p1',
    name: 'Sarah Johnson',
    age: 45,
    gender: 'female',
    disease: 'Suspected Breast Cancer',
    scanType: 'Mammogram',
    scanDate: '2026-05-10',
    status: 'positive',
    doctorId: 'd1',
    aiAnalysis: {
      confidence: 87.5,
      findings: [
        'Irregular mass detected in upper outer quadrant',
        'Micro-calcifications present',
        'Spiculated margins observed'
      ],
      recommendation: 'Immediate biopsy recommended. Schedule follow-up MRI for detailed assessment.',
      riskLevel: 'high'
    }
  },
  {
    id: 'p2',
    name: 'Emily Chen',
    age: 38,
    gender: 'female',
    disease: 'Routine Screening',
    scanType: 'MRI',
    scanDate: '2026-05-11',
    status: 'negative',
    doctorId: 'd1',
    aiAnalysis: {
      confidence: 94.2,
      findings: [
        'No suspicious masses detected',
        'Normal breast tissue density',
        'No calcifications observed'
      ],
      recommendation: 'Continue regular annual screening. No immediate action required.',
      riskLevel: 'low'
    }
  },
  {
    id: 'p3',
    name: 'Maria Garcia',
    age: 52,
    gender: 'female',
    disease: 'Follow-up Scan',
    scanType: 'Both',
    scanDate: '2026-05-12',
    status: 'pending',
    doctorId: 'd1'
  },
  {
    id: 'p4',
    name: 'Lisa Williams',
    age: 41,
    gender: 'female',
    disease: 'Family History Screening',
    scanType: 'Mammogram',
    scanDate: '2026-05-09',
    status: 'inconclusive',
    doctorId: 'd1',
    aiAnalysis: {
      confidence: 62.3,
      findings: [
        'Dense breast tissue limiting visibility',
        'Small nodule requires further evaluation',
        'Asymmetric density in left breast'
      ],
      recommendation: 'Additional imaging recommended. Consider ultrasound for better assessment.',
      riskLevel: 'moderate'
    }
  },
  {
    id: 'p5',
    name: 'Jennifer Brown',
    age: 55,
    gender: 'female',
    disease: 'Post-treatment Monitoring',
    scanType: 'MRI',
    scanDate: '2026-05-08',
    status: 'negative',
    doctorId: 'd1',
    aiAnalysis: {
      confidence: 91.8,
      findings: [
        'No recurrence detected',
        'Surgical site healing normally',
        'Lymph nodes appear normal'
      ],
      recommendation: 'Continue monitoring every 6 months. No signs of recurrence.',
      riskLevel: 'low'
    }
  }
]

const sampleDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. James Wilson',
    email: 'doctor@oncoscanxai.com',
    role: 'doctor',
    specialization: 'Oncology',
    patientsCount: 5
  },
  {
    id: 'd2',
    name: 'Dr. Amanda Roberts',
    email: 'amanda@oncoscanxai.com',
    role: 'doctor',
    specialization: 'Radiology',
    patientsCount: 12
  }
]
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      patients: samplePatients,
      doctors: sampleDoctors,
      isAuthenticated: false,
      guestPatientId: null,

      login: (user) =>
        set({
          currentUser: user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          currentUser: null,
          isAuthenticated: false,
          guestPatientId: null,
        }),

      addPatient: (patient) =>
        set((state) => ({
          patients: [
            ...state.patients,
            patient,
          ],
        })),

      updatePatient: (id, updates) =>
        set((state) => ({
          patients: state.patients.map((p) =>
            p.id === id
              ? { ...p, ...updates }
              : p
          ),
        })),

      deletePatient: (id) =>
        set((state) => ({
          patients: state.patients.filter(
            (p) => p.id !== id
          ),
        })),

      addDoctor: (doctor) =>
        set((state) => ({
          doctors: [
            ...state.doctors,
            doctor,
          ],
        })),

      setGuestPatientId: (id) =>
        set({ guestPatientId: id }),

      getPatientById: (id) =>
        get().patients.find(
          (p) => p.id === id
        ),
    }),
    {
      name: 'oncoscan-storage',
    }
  )
)

// Demo credentials for testing
export const demoCredentials = {
  doctor: {
    email: 'doctor@oncoscanxai.com',
    password: 'doctor123',
    name: 'Dr. James Wilson',
    specialization: 'Oncology'
  },
  admin: {
    email: 'admin@oncoscanxai.com',
    password: 'admin123',
    name: 'System Administrator'
  },
  guest: {
    patientId: 'p1'
  }
}

