import { createFileRoute } from '@tanstack/react-router'
import { GuardianEdit } from '@/features/guardians/guardian-edit'

export const Route = createFileRoute(
  '/_authenticated/guardians/$guardianId/edit'
)({
  component: GuardianEdit,
})
