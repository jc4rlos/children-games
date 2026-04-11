import { z } from 'zod'

export const classDays = [
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
  'SUN',
] as const
export type ClassDay = (typeof classDays)[number]

export const classDayLabels: Record<ClassDay, string> = {
  MON: 'Lunes',
  TUE: 'Martes',
  WED: 'Miércoles',
  THU: 'Jueves',
  FRI: 'Viernes',
  SAT: 'Sábado',
  SUN: 'Domingo',
}

export const stimulationClassSchema = z.object({
  id: z.number(),
  branchId: z.number(),
  branchName: z.string(),
  teacherId: z.number().nullable(),
  teacherName: z.string().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  ageMinMonths: z.number(),
  ageMaxMonths: z.number(),
  capacity: z.number(),
  price: z.number(),
  daysOfWeek: z.array(z.enum(classDays)),
  startTime: z.string(),
  endTime: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
})

export type StimulationClass = z.infer<typeof stimulationClassSchema>

export const classFormSchema = z.object({
  branchId: z
    .number({ message: 'La sucursal es requerida' })
    .min(1, 'La sucursal es requerida'),
  teacherId: z.number().nullable().optional(),
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  ageMinMonths: z.coerce
    .number()
    .min(0, 'Mínimo 0 meses')
    .max(120, 'Máximo 120 meses'),
  ageMaxMonths: z.coerce
    .number()
    .min(0, 'Mínimo 0 meses')
    .max(120, 'Máximo 120 meses'),
  capacity: z.coerce.number().min(1, 'La capacidad mínima es 1'),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  daysOfWeek: z
    .array(z.enum(classDays))
    .min(1, 'Selecciona al menos un día'),
  startTime: z.string().min(1, 'La hora de inicio es requerida'),
  endTime: z.string().min(1, 'La hora de fin es requerida'),
  isActive: z.boolean(),
})

export type ClassFormValues = z.infer<typeof classFormSchema>

export type ClassEnrollment = {
  id: number
  classId: number
  childId: number
  childName: string
  childAvatar: string | null
  childGender: 'MALE' | 'FEMALE'
  childBirthDate: string
  childCode: string
  enrolledAt: string
  enrolledByName: string | null
  isActive: boolean
}

export type ClassAttendanceRecord = {
  enrollmentId: number
  childId: number
  childName: string
  childAvatar: string | null
  childGender: 'MALE' | 'FEMALE'
  childBirthDate: string
  childCode: string
  attendanceId: number | null
  attended: boolean | null
}
