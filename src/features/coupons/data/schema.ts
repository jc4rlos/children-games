import { z } from 'zod'

export const discountTypes = ['PERCENTAGE', 'FIXED_AMOUNT'] as const
export type DiscountType = (typeof discountTypes)[number]

export const discountTypeLabels: Record<DiscountType, string> = {
  PERCENTAGE: 'Porcentaje (%)',
  FIXED_AMOUNT: 'Monto fijo',
}

export const couponSchema = z.object({
  id: z.number(),
  branchId: z.number().nullable(),
  branchName: z.string().nullable(),
  code: z.string(),
  description: z.string().nullable(),
  discountType: z.enum(discountTypes),
  discountValue: z.number(),
  maxUses: z.number().nullable(),
  usesCount: z.number(),
  validFrom: z.string(),
  validUntil: z.string().nullable(),
  isActive: z.boolean(),
})

export type Coupon = z.infer<typeof couponSchema>

export const couponFormSchema = z.object({
  branchId: z.number().nullable().optional(),
  code: z.string().min(1, 'El código es requerido').max(50),
  description: z.string().max(200).optional(),
  discountType: z.enum(discountTypes, { message: 'El tipo de descuento es requerido' }),
  discountValue: z.coerce.number().positive('Debe ser mayor a 0'),
  maxUses: z.string().optional(),
  validFrom: z.string().min(1, 'La fecha de inicio es requerida'),
  validUntil: z.string().optional(),
  isActive: z.boolean(),
})

export type CouponFormValues = z.infer<typeof couponFormSchema>
