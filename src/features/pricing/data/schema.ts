import { z } from 'zod'

export const pricingConfigSchema = z.object({
  id: z.number(),
  branchId: z.number(),
  branchName: z.string(),
  pricePerHour: z.number(),
  minimumCharge: z.number(),
  validFrom: z.string(),
  validUntil: z.string().nullable(),
  description: z.string().nullable(),
})

export type PricingConfig = z.infer<typeof pricingConfigSchema>

export const pricingConfigFormSchema = z.object({
  branchId: z.number({ message: 'La sucursal es requerida' }),
  description: z.string().optional(),
  pricePerHour: z.coerce.number().positive('Debe ser mayor a 0'),
  minimumCharge: z.coerce.number().min(0, 'No puede ser negativo'),
  validFrom: z.string().min(1, 'La fecha de inicio es requerida'),
  validUntil: z.string().optional(),
})

export type PricingConfigFormValues = z.infer<typeof pricingConfigFormSchema>
