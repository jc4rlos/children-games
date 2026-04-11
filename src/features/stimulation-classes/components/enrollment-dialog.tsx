import { useState } from 'react'
import {
  Alert,
  AlertDescription,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@boilerplate/ui'
import { AlertTriangle } from 'lucide-react'
import { ChildSessionPickerDialog } from '@/features/sessions/components/child-session-picker-dialog'
import { type ChildSelectOption } from '@/features/sessions/data/sessions-service'
import { useTeachersForClass } from '../hooks/use-classes'
import { useEnrollChild } from '../hooks/use-enrollment'

type EnrollmentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  classInfo: { id: number; name: string; capacity: number }
  enrolledCount: number
}

export const EnrollmentDialog = ({
  open,
  onOpenChange,
  classInfo,
  enrolledCount,
}: EnrollmentDialogProps) => {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [enrolledById, setEnrolledById] = useState<string>('none')

  const { data: employees = [] } = useTeachersForClass()
  const enrollMutation = useEnrollChild(classInfo.id)

  const isFull = enrolledCount >= classInfo.capacity

  const handleSelectChild = (child: ChildSelectOption) => {
    const enrolledBy =
      enrolledById !== 'none' ? Number(enrolledById) : null
    enrollMutation.mutate(
      { childId: child.id, enrolledBy },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setEnrolledById('none')
    }
    onOpenChange(next)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Inscribir niño en {classInfo.name}</DialogTitle>
          </DialogHeader>

          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>
                Inscritos: {enrolledCount} / {classInfo.capacity}
              </span>
            </div>

            {isFull && (
              <Alert variant='destructive'>
                <AlertTriangle className='h-4 w-4' />
                <AlertDescription>
                  Esta clase ya alcanzó su capacidad máxima.
                </AlertDescription>
              </Alert>
            )}

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Registrado por</label>
              <Select value={enrolledById} onValueChange={setEnrolledById}>
                <SelectTrigger>
                  <SelectValue placeholder='Sin especificar' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='none'>Sin especificar</SelectItem>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => setPickerOpen(true)}
                disabled={isFull || enrollMutation.isPending}
              >
                Seleccionar niño
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ChildSessionPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleSelectChild}
      />
    </>
  )
}
