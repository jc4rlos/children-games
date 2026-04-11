import { createFileRoute } from '@tanstack/react-router'
import { ChildCreate } from '@/features/children/child-create'

export const Route = createFileRoute('/_authenticated/children/new')({
  component: ChildCreate,
})
