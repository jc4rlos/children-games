import { z } from 'zod'

export const genderValues = ['MALE', 'FEMALE'] as const
export type Gender = (typeof genderValues)[number]

export const genderLabels: Record<Gender, string> = {
  MALE: 'Niño',
  FEMALE: 'Niña',
}

export const childSchema = z.object({
  id: z.number(),
  guardianId: z.number(),
  branchId: z.number(),
  fullName: z.string(),
  gender: z.enum(genderValues),
  avatar: z.string().nullable(),
  birthDate: z.string(),
  code: z.string(),
  notes: z.string().nullable(),
  isActive: z.boolean(),
  loyaltyStampsCount: z.number().nullable().optional(),
  loyaltyStampsRequired: z.number().nullable().optional(),
  loyaltyFreeSessions: z.number().nullable().optional(),
})

export type Child = z.infer<typeof childSchema>

export const childFormSchema = z.object({
  guardianId: z.number({ message: 'El apoderado es requerido' }),
  branchId: z.number({ message: 'La sucursal es requerida' }),
  fullName: z.string().min(1, 'El nombre completo es requerido'),
  gender: z.enum(genderValues, { message: 'El género es requerido' }),
  birthDate: z.string().min(1, 'La fecha de nacimiento es requerida'),
  notes: z.string().optional(),
  isActive: z.boolean(),
})

export type ChildFormValues = z.infer<typeof childFormSchema>
