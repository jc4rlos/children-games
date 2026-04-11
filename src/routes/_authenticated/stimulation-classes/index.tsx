import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import { StimulationClasses } from '@/features/stimulation-classes'

const searchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  name: z.string().optional().catch(''),
  isActive: z.array(z.string()).optional().catch([]),
})

export const Route = createFileRoute('/_authenticated/stimulation-classes/')({
  validateSearch: searchSchema,
  component: StimulationClasses,
})
