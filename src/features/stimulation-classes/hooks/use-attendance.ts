import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getAttendanceSheet,
  saveAttendanceBatch,
} from '../data/attendance-service'

export const attendanceQueryKeys = {
  sheet: (classId: number, date: string) =>
    ['stimulation-classes', 'attendance', classId, date] as const,
}

export const useAttendanceSheet = (classId: number, date: string) =>
  useQuery({
    queryKey: attendanceQueryKeys.sheet(classId, date),
    queryFn: () => getAttendanceSheet(classId, date),
    enabled: classId > 0 && date.length > 0,
  })

export const useSaveAttendance = (classId: number, date: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (
      records: { enrollmentId: number; classDate: string; attended: boolean }[]
    ) => saveAttendanceBatch(records),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: attendanceQueryKeys.sheet(classId, date),
      })
      toast.success('Asistencia guardada exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al guardar la asistencia: ${error.message}`)
    },
  })
}
