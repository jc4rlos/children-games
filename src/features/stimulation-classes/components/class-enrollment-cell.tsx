import { Button } from '@boilerplate/ui'
import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import type { StimulationClass } from '../data/schema'
import { EnrollmentDialog } from './enrollment-dialog'

type ClassEnrollmentCellProps = {
  cls: StimulationClass
  enrolledCount: number
}

export const ClassEnrollmentCell = ({
  cls,
  enrolledCount,
}: ClassEnrollmentCellProps) => {
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false)

  const hasAvailableSlots = enrolledCount < cls.capacity
  const availableSlots = cls.capacity - enrolledCount

  return (
    <>
      <Button
        size='sm'
        disabled={!hasAvailableSlots}
        onClick={() => setEnrollDialogOpen(true)}
        title={
          hasAvailableSlots
            ? `${availableSlots} cupos disponibles`
            : 'Sin cupos disponibles'
        }
      >
        <UserPlus size={16} className='me-1' />
        Inscribir
      </Button>

      <EnrollmentDialog
        open={enrollDialogOpen}
        onOpenChange={setEnrollDialogOpen}
        classInfo={{
          id: cls.id,
          name: cls.name,
          capacity: cls.capacity,
        }}
        enrolledCount={enrolledCount}
      />
    </>
  )
}
