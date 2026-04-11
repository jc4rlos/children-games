import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  enrollChild,
  getEnrollments,
  unenrollChild,
} from '../data/enrollment-service'

export const enrollmentQueryKeys = {
  list: (classId: number) =>
    ['stimulation-classes', 'enrollments', classId] as const,
}

export const useEnrollments = (classId: number) =>
  useQuery({
    queryKey: enrollmentQueryKeys.list(classId),
    queryFn: () => getEnrollments(classId),
    enabled: classId > 0,
  })

export const useEnrollChild = (classId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      childId,
      enrolledBy,
    }: {
      childId: number
      enrolledBy: number | null
    }) => enrollChild(classId, childId, enrolledBy),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: enrollmentQueryKeys.list(classId),
      })
      queryClient.invalidateQueries({ queryKey: ['stimulation-classes'] })
      toast.success('Niño inscrito exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al inscribir al niño: ${error.message}`)
    },
  })
}

export const useUnenrollChild = (classId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (enrollmentId: number) => unenrollChild(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: enrollmentQueryKeys.list(classId),
      })
      queryClient.invalidateQueries({ queryKey: ['stimulation-classes'] })
      toast.success('Niño dado de baja de la clase.')
    },
    onError: (error: Error) => {
      toast.error(`Error al dar de baja al niño: ${error.message}`)
    },
  })
}
