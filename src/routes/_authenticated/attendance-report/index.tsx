import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { AttendanceReport } from '@/features/attendance-report'

const now = new Date()
const defaultDateFrom = new Date(now.getFullYear(), now.getMonth(), 1)
  .toISOString()
  .slice(0, 10)
const defaultDateTo = now.toISOString().slice(0, 10)

const searchSchema = z.object({
  classId: z.number().optional().catch(0),
  dateFrom: z.string().optional().catch(defaultDateFrom),
  dateTo: z.string().optional().catch(defaultDateTo),
})

export const Route = createFileRoute('/_authenticated/attendance-report/')({
  validateSearch: searchSchema,
  component: AttendanceReport,
})
