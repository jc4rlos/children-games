import { useQuery } from '@tanstack/react-query'
import { getClassesForSelect } from '@/features/stimulation-classes/data/classes-service'
import { getAttendanceReport } from '../data/attendance-report-service'
import type { AttendanceReportParams } from '../data/schema'

export const useClassesForReport = () =>
  useQuery({
    queryKey: ['attendance-report', 'classes'],
    queryFn: getClassesForSelect,
    staleTime: 5 * 60 * 1000,
  })

export const useAttendanceReport = (params: AttendanceReportParams) =>
  useQuery({
    queryKey: ['attendance-report', params],
    queryFn: () => getAttendanceReport(params),
    enabled: params.classId > 0,
    placeholderData: (prev) => prev,
  })
