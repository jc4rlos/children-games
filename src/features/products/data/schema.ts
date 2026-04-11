import { z } from 'zod'

export const productSchema = z.object({
  id: z.number(),
  branchId: z.number().nullable(),
  branchName: z.string().nullable(),
  categoryId: z.number(),
  categoryName: z.string(),
  name: z.string(),
  price: z.number(),
  stock: z.number(),
  imageUrl: z.string().nullable(),
  isActive: z.boolean(),
})

export type Product = z.infer<typeof productSchema>

export const productFormSchema = z.object({
  branchId: z.number().nullable().optional(),
  categoryId: z.coerce.number().min(1, 'La categoría es requerida'),
  name: z.string().min(1, 'El nombre es requerido').max(150),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
  stock: z.coerce.number().min(0, 'El stock no puede ser negativo').default(0),
  imageUrl: z.string().url('URL inválida').or(z.literal('')).optional(),
  isActive: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
