import { useState } from 'react'
import { Button, Skeleton } from '@boilerplate/ui'
import { CalendarDays, Save } from 'lucide-react'
import { getAvatarUrl } from '@/features/children/data/avatar-utils'
import { type ClassAttendanceRecord } from '../data/schema'
import { useAttendanceSheet, useSaveAttendance } from '../hooks/use-attendance'
import { useEnrollments } from '../hooks/use-enrollment'

type AttendanceTabProps = {
  classId: number
}

const today = () => new Date().toISOString().slice(0, 10)

export const AttendanceTab = ({ classId }: AttendanceTabProps) => {
  const [selectedDate, setSelectedDate] = useState(today)
  const [localAttendance, setLocalAttendance] = useState<
    Map<number, boolean>
  >(new Map())

  const { data: enrollments = [] } = useEnrollments(classId)
  const { data: sheet = [], isLoading } = useAttendanceSheet(
    classId,
    selectedDate
  )
  const saveMutation = useSaveAttendance(classId, selectedDate)

  const getAttended = (record: ClassAttendanceRecord): boolean | null => {
    if (localAttendance.has(record.enrollmentId)) {
      return localAttendance.get(record.enrollmentId)!
    }
    return record.attended
  }

  const toggle = (enrollmentId: number, current: boolean | null) => {
    setLocalAttendance((prev) => {
      const next = new Map(prev)
      next.set(enrollmentId, current === true ? false : true)
      return next
    })
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setLocalAttendance(new Map())
  }

  const handleSave = () => {
    const records = sheet.map((r) => ({
      enrollmentId: r.enrollmentId,
      classDate: selectedDate,
      attended: getAttended(r) ?? false,
    }))
    saveMutation.mutate(records, {
      onSuccess: () => setLocalAttendance(new Map()),
    })
  }

  const presentCount = sheet.filter((r) => getAttended(r) === true).length

  if (enrollments.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <CalendarDays size={40} className='mb-3 text-muted-foreground' />
        <p className='text-muted-foreground'>
          No hay niños inscritos para registrar asistencia.
        </p>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <label className='text-sm font-medium'>Fecha</label>
          <input
            type='date'
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className='flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
          />
        </div>
        {sheet.length > 0 && (
          <p className='text-sm text-muted-foreground'>
            <span className='font-medium text-foreground'>{presentCount}</span>{' '}
            de {sheet.length} presentes
          </p>
        )}
      </div>

      {isLoading ? (
        <div className='space-y-3'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='flex items-center gap-3'>
              <Skeleton className='h-10 w-10 rounded-full' />
              <div className='flex-1 space-y-1'>
                <Skeleton className='h-4 w-40' />
              </div>
              <Skeleton className='h-10 w-28 rounded-md' />
            </div>
          ))}
        </div>
      ) : sheet.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-8 text-center'>
          <p className='text-muted-foreground text-sm'>
            No hay inscritos activos para esta fecha.
          </p>
        </div>
      ) : (
        <div className='divide-y rounded-md border'>
          {sheet.map((record) => {
            const attended = getAttended(record)
            const avatarSrc =
              record.childAvatar ??
              getAvatarUrl(record.childCode, record.childGender)

            return (
              <div
                key={record.enrollmentId}
                className='flex items-center gap-3 px-4 py-3'
              >
                <img
                  src={avatarSrc}
                  alt={record.childName}
                  className='h-10 w-10 rounded-full object-cover shrink-0'
                />
                <p className='flex-1 font-medium min-w-0 truncate'>
                  {record.childName}
                </p>
                <button
                  type='button'
                  onClick={() => toggle(record.enrollmentId, attended)}
                  className={`flex h-10 min-w-28 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors ${
                    attended === true
                      ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                      : attended === false
                        ? 'border-red-300 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
                        : 'border-input bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {attended === true
                    ? 'Presente'
                    : attended === false
                      ? 'Ausente'
                      : 'Sin marcar'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {sheet.length > 0 && (
        <div className='flex justify-end'>
          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            <Save size={16} className='me-1' />
            {saveMutation.isPending ? 'Guardando...' : 'Guardar asistencia'}
          </Button>
        </div>
      )}
    </div>
  )
}
