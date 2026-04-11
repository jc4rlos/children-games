import { z } from 'zod'

export const productCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  isActive: z.boolean(),
})

export type ProductCategory = z.infer<typeof productCategorySchema>

export const productCategoryFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  isActive: z.boolean(),
})

export type ProductCategoryFormValues = z.infer<typeof productCategoryFormSchema>
