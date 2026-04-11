import { createFileRoute } from '@tanstack/react-router'
import { SessionCreate } from '@/features/sessions/session-create'

export const Route = createFileRoute('/_authenticated/sessions/new')({
  component: SessionCreate,
})
