import { z } from 'zod'

export const guardianSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  documentNumber: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
})

export type Guardian = z.infer<typeof guardianSchema>

export const guardianFormSchema = z.object({
  fullName: z.string().min(1, 'El nombre completo es requerido'),
  documentNumber: z.string().min(1, 'El número de documento es requerido'),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').or(z.literal('')).optional(),
})

export type GuardianFormValues = z.infer<typeof guardianFormSchema>
