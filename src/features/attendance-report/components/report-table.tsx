import { Skeleton } from '@boilerplate/ui'
import { cn } from '@/lib/utils'
import { getAvatarUrl } from '@/features/children/data/avatar-utils'
import { type AttendanceReportRow } from '../data/schema'

type ReportTableProps = {
  data: AttendanceReportRow[]
  isLoading: boolean
  classSelected: boolean
}

export const ReportTable = ({
  data,
  isLoading,
  classSelected,
}: ReportTableProps) => {
  if (!classSelected) {
    return (
      <div className='flex items-center justify-center rounded-md border py-16 text-sm text-muted-foreground'>
        Selecciona una clase para ver el reporte.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='space-y-3'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='h-14 w-full rounded-md' />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className='flex items-center justify-center rounded-md border py-16 text-sm text-muted-foreground'>
        No hay alumnos inscritos activos en esta clase.
      </div>
    )
  }

  const totalAttended = data.reduce((sum, r) => sum + r.attendedCount, 0)
  const totalSessions = data.reduce((sum, r) => sum + r.totalSessions, 0)

  return (
    <div className='overflow-hidden rounded-md border'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b bg-muted/50'>
            <th className='px-4 py-3 text-left font-medium text-muted-foreground'>
              Alumno
            </th>
            <th className='px-4 py-3 text-center font-medium text-muted-foreground'>
              Clases
            </th>
            <th className='px-4 py-3 text-center font-medium text-teal-600 dark:text-teal-400'>
              Asistió
            </th>
            <th className='px-4 py-3 text-center font-medium text-destructive'>
              Faltó
            </th>
            <th className='px-4 py-3 text-center font-medium text-muted-foreground'>
              % Asistencia
            </th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {data.map((row) => {
            const avatarSrc =
              row.childAvatar ?? getAvatarUrl(row.childCode, row.childGender)

            return (
              <tr
                key={row.enrollmentId}
                className='bg-background transition-colors hover:bg-muted/40'
              >
                <td className='px-4 py-3'>
                  <div className='flex items-center gap-3'>
                    <img
                      src={avatarSrc}
                      alt={row.childName}
                      className='h-9 w-9 shrink-0 rounded-full object-cover'
                    />
                    <div>
                      <p className='leading-tight font-medium'>
                        {row.childName}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {row.childCode}
                      </p>
                    </div>
                  </div>
                </td>
                <td className='px-4 py-3 text-center text-muted-foreground'>
                  {row.totalSessions}
                </td>
                <td className='px-4 py-3 text-center font-medium text-teal-600 dark:text-teal-400'>
                  {row.attendedCount}
                </td>
                <td className='px-4 py-3 text-center font-medium text-destructive'>
                  {row.absentCount}
                </td>
                <td className='px-4 py-3 text-center'>
                  <AttendanceRateBadge
                    rate={row.attendanceRate}
                    total={row.totalSessions}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
        {data.length > 1 && (
          <tfoot>
            <tr className='border-t bg-muted/50'>
              <td className='px-4 py-3 font-medium text-muted-foreground'>
                Total ({data.length} alumnos)
              </td>
              <td className='px-4 py-3 text-center font-medium text-muted-foreground'>
                {totalSessions}
              </td>
              <td className='px-4 py-3 text-center font-medium text-teal-600 dark:text-teal-400'>
                {totalAttended}
              </td>
              <td className='px-4 py-3 text-center font-medium text-destructive'>
                {totalSessions - totalAttended}
              </td>
              <td className='px-4 py-3 text-center'>
                <AttendanceRateBadge
                  rate={
                    totalSessions > 0
                      ? Math.round((totalAttended / totalSessions) * 100)
                      : 0
                  }
                  total={totalSessions}
                />
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}

const AttendanceRateBadge = ({
  rate,
  total,
}: {
  rate: number
  total: number
}) => {
  if (total === 0) {
    return <span className='text-xs text-muted-foreground'>Sin registros</span>
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        rate >= 80
          ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
          : rate >= 50
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
      )}
    >
      {rate}%
    </span>
  )
}
