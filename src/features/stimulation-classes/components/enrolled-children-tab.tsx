import { Button, Skeleton } from '@boilerplate/ui'
import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { getAvatarUrl } from '@/features/children/data/avatar-utils'
import { calculateAge } from '@/features/sessions/data/schema'
import { useEnrollments, useUnenrollChild } from '../hooks/use-enrollment'
import { EnrollmentDialog } from './enrollment-dialog'

const genderLabel: Record<'MALE' | 'FEMALE', string> = {
  MALE: 'Niño',
  FEMALE: 'Niña',
}

const genderClass: Record<'MALE' | 'FEMALE', string> = {
  MALE: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
  FEMALE: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200',
}

type EnrolledChildrenTabProps = {
  classInfo: { id: number; name: string; capacity: number }
}

export const EnrolledChildrenTab = ({
  classInfo,
}: EnrolledChildrenTabProps) => {
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false)

  const { data: enrollments = [], isLoading } = useEnrollments(classInfo.id)
  const unenrollMutation = useUnenrollChild(classInfo.id)

  if (isLoading) {
    return (
      <div className='space-y-3'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='flex items-center gap-3'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <div className='flex-1 space-y-1'>
              <Skeleton className='h-4 w-40' />
              <Skeleton className='h-3 w-24' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>
          {enrollments.length} inscrito{enrollments.length !== 1 ? 's' : ''} de{' '}
          {classInfo.capacity} cupos
        </p>
        <Button size='sm' onClick={() => setEnrollDialogOpen(true)}>
          <UserPlus size={16} className='me-1' />
          Inscribir niño
        </Button>
      </div>

      {enrollments.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <UserPlus size={40} className='mb-3 text-muted-foreground' />
          <p className='text-muted-foreground'>
            No hay niños inscritos en esta clase.
          </p>
          <Button
            variant='outline'
            size='sm'
            className='mt-3'
            onClick={() => setEnrollDialogOpen(true)}
          >
            Inscribir el primero
          </Button>
        </div>
      ) : (
        <div className='divide-y rounded-md border'>
          {enrollments.map((enrollment) => {
            const avatarSrc =
              enrollment.childAvatar ??
              getAvatarUrl(enrollment.childCode, enrollment.childGender)
            const age = calculateAge(enrollment.childBirthDate)
            const enrolledDate = new Date(
              enrollment.enrolledAt
            ).toLocaleDateString('es-PE')

            return (
              <div
                key={enrollment.id}
                className='flex items-center gap-3 px-4 py-3'
              >
                <img
                  src={avatarSrc}
                  alt={enrollment.childName}
                  className='h-10 w-10 rounded-full object-cover'
                />
                <div className='min-w-0 flex-1'>
                  <p className='truncate font-medium'>{enrollment.childName}</p>
                  <p className='text-xs text-muted-foreground'>
                    {age} años · Inscrito el {enrolledDate}
                    {enrollment.enrolledByName &&
                      ` por ${enrollment.enrolledByName}`}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${genderClass[enrollment.childGender]}`}
                >
                  {genderLabel[enrollment.childGender]}
                </span>
                <Button
                  size='sm'
                  variant='outline'
                  className='shrink-0 text-destructive hover:text-destructive'
                  disabled={unenrollMutation.isPending}
                  onClick={() => unenrollMutation.mutate(enrollment.id)}
                >
                  Dar de baja
                </Button>
              </div>
            )
          })}
        </div>
      )}

      <EnrollmentDialog
        open={enrollDialogOpen}
        onOpenChange={setEnrollDialogOpen}
        classInfo={classInfo}
        enrolledCount={enrollments.length}
      />
    </div>
  )
}
