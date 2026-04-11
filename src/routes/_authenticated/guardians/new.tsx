import { createFileRoute } from '@tanstack/react-router'
import { GuardianCreate } from '@/features/guardians/guardian-create'

export const Route = createFileRoute('/_authenticated/guardians/new')({
  component: GuardianCreate,
})
