import { z } from 'zod'

export const sessionStatuses = ['ACTIVE', 'CLOSED', 'FREE'] as const
export type SessionStatus = (typeof sessionStatuses)[number]

export const sessionStatusLabels: Record<SessionStatus, string> = {
  ACTIVE: 'Activa',
  CLOSED: 'Finalizada',
  FREE: 'Gratuita',
}

export const durationOptions = [
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1½ h' },
  { value: 120, label: '2 horas' },
  { value: 180, label: '3 horas' },
  { value: 240, label: '4 horas' },
  { value: 300, label: '5 horas' },
  { value: 360, label: '6 horas' },
  { value: 480, label: '8 horas' },
  { value: 600, label: '10 horas' },
] as const

export const playSessionSchema = z.object({
  id: z.number(),
  branchId: z.number(),
  branchName: z.string(),
  childId: z.number(),
  childName: z.string(),
  childAvatar: z.string().nullable(),
  childGender: z.enum(['MALE', 'FEMALE']),
  childBirthDate: z.string(),
  childCode: z.string(),
  pricingId: z.number(),
  pricePerHour: z.number(),
  minimumCharge: z.number(),
  couponId: z.number().nullable(),
  couponCode: z.string().nullable(),
  registeredById: z.number(),
  registeredByName: z.string(),
  status: z.enum(sessionStatuses),
  isFreeSession: z.boolean(),
  checkIn: z.string(),
  checkOut: z.string().nullable(),
  scheduledCheckout: z.string().nullable(),
  minutesPlayed: z.number().nullable(),
  playSubtotal: z.number().nullable(),
  productsSubtotal: z.number().nullable(),
  discountAmount: z.number().nullable(),
  totalAmount: z.number().nullable(),
  consumptionsCount: z.number(),
  notes: z.string().nullable(),
})

export type PlaySession = z.infer<typeof playSessionSchema>

export const sessionFormSchema = z.object({
  childId: z
    .number({ message: 'El niño es requerido' })
    .min(1, 'El niño es requerido'),
  branchId: z
    .number({ message: 'La sucursal es requerida' })
    .min(1, 'La sucursal es requerida'),
  pricingId: z
    .number({ message: 'La tarifa es requerida' })
    .min(1, 'La tarifa es requerida'),
  durationMinutes: z
    .number({ message: 'Selecciona una duración' })
    .min(30, 'Selecciona una duración'),
  couponId: z.number().nullable().optional(),
  registeredById: z
    .number({ message: 'El empleado es requerido' })
    .min(1, 'El empleado es requerido'),
  isFreeSession: z.boolean(),
  notes: z.string().optional(),
})

export type SessionFormValues = z.infer<typeof sessionFormSchema>

export const calculateAge = (birthDate: string): number => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export const formatElapsed = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export const calcEstimatedCost = (
  checkIn: string,
  pricePerHour: number,
  minimumCharge: number
): number => {
  const elapsedHours = (Date.now() - new Date(checkIn).getTime()) / 3_600_000
  return Math.max(minimumCharge, elapsedHours * pricePerHour)
}
