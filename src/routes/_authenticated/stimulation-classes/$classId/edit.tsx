import { createFileRoute } from '@tanstack/react-router'
import { ClassEdit } from '@/features/stimulation-classes/class-edit'

export const Route = createFileRoute(
  '/_authenticated/stimulation-classes/$classId/edit'
)({
  component: ClassEdit,
})
