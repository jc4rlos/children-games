import { createFileRoute } from '@tanstack/react-router'
import { ClassDetail } from '@/features/stimulation-classes/class-detail'

export const Route = createFileRoute(
  '/_authenticated/stimulation-classes/$classId/'
)({
  component: ClassDetail,
})
