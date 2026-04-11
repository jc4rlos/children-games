import { createFileRoute } from '@tanstack/react-router'
import { ClassCreate } from '@/features/stimulation-classes/class-create'

export const Route = createFileRoute('/_authenticated/stimulation-classes/new')(
  {
    component: ClassCreate,
  }
)
