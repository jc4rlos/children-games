import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ParentPortal } from '@/features/parent-portal'

const portalSearchSchema = z.object({
  code: z.string().optional().catch(''),
  tab: z.string().optional().catch('stamps'),
})

export const Route = createFileRoute('/portal')({
  validateSearch: portalSearchSchema,
  component: ParentPortal,
})
