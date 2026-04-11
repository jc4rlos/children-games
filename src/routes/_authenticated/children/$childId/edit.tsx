import { createFileRoute } from '@tanstack/react-router'
import { ChildEdit } from '@/features/children/child-edit'

export const Route = createFileRoute('/_authenticated/children/$childId/edit')({
  component: ChildEdit,
})
