import { getRouteApi } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { ReportFilters } from './components/report-filters'
import { ReportTable } from './components/report-table'
import { useAttendanceReport, useClassesForReport } from './hooks/use-attendance-report'

const route = getRouteApi('/_authenticated/attendance-report/')

const now = new Date()
const DEFAULT_DATE_FROM = new Date(now.getFullYear(), now.getMonth(), 1)
  .toISOString()
  .slice(0, 10)
const DEFAULT_DATE_TO = now.toISOString().slice(0, 10)

export const AttendanceReport = () => {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const classId = search.classId ?? 0
  const dateFrom = search.dateFrom ?? DEFAULT_DATE_FROM
  const dateTo = search.dateTo ?? DEFAULT_DATE_TO

  const { data: classes = [] } = useClassesForReport()

  const { data = [], isLoading } = useAttendanceReport({ classId, dateFrom, dateTo })

  const isFiltered =
    classId > 0 || dateFrom !== DEFAULT_DATE_FROM || dateTo !== DEFAULT_DATE_TO

  const handleClassChange = (id: number) => {
    navigate({ search: (prev) => ({ ...prev, classId: id }) })
  }

  const handleDateFromChange = (date: string) => {
    navigate({ search: (prev) => ({ ...prev, dateFrom: date }) })
  }

  const handleDateToChange = (date: string) => {
    navigate({ search: (prev) => ({ ...prev, dateTo: date }) })
  }

  const handleReset = () => {
    navigate({
      search: { classId: 0, dateFrom: DEFAULT_DATE_FROM, dateTo: DEFAULT_DATE_TO },
    })
  }

  const selectedClass = classes.find((c) => c.id === classId)

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>
          Reporte de Asistencias
        </h2>
        <p className='text-muted-foreground'>
          Consulta la asistencia de cada alumno por clase en un rango de fechas.
        </p>
      </div>

      <ReportFilters
        classes={classes}
        classId={classId}
        dateFrom={dateFrom}
        dateTo={dateTo}
        isFiltered={isFiltered}
        onClassChange={handleClassChange}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
        onReset={handleReset}
      />

      {selectedClass && (
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <span>Clase:</span>
          <span className='font-medium text-foreground'>{selectedClass.name}</span>
          <span>·</span>
          <span>{selectedClass.branchName}</span>
          <span>·</span>
          <span>
            {dateFrom} — {dateTo}
          </span>
        </div>
      )}

      <ReportTable
        data={data}
        isLoading={isLoading}
        classSelected={classId > 0}
      />
    </Main>
  )
}
