import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import { Guardians } from '@/features/guardians'

const guardiansSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/guardians/')({
  validateSearch: guardiansSearchSchema,
  component: Guardians,
})
