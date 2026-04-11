import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Children } from '@/features/children'

const childrenSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  name: z.string().optional().catch(''),
  gender: z.array(z.string()).optional().catch([]),
  isActive: z.array(z.string()).optional().catch([]),
})

export const Route = createFileRoute('/_authenticated/children/')({
  validateSearch: childrenSearchSchema,
  component: Children,
})
