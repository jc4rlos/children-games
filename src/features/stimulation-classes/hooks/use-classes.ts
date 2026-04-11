import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getBranchesForSelect } from '@/features/branches/data/branches-service'
import {
  type ClassesParams,
  createClass,
  deleteClass,
  getClassById,
  getClasses,
  getEnrolledCounts,
  getTeachersForSelect,
  updateClass,
} from '../data/classes-service'
import type { ClassFormValues } from '../data/schema'

export const classQueryKeys = {
  list: (params: ClassesParams) =>
    ['stimulation-classes', 'list', params] as const,
  detail: (id: number) => ['stimulation-classes', id] as const,
  branches: ['stimulation-classes', 'branches'] as const,
  teachers: ['stimulation-classes', 'teachers'] as const,
  enrolledCounts: (ids: number[]) =>
    ['stimulation-classes', 'enrolled-counts', ids] as const,
}

export const useClasses = (params: ClassesParams) =>
  useQuery({
    queryKey: classQueryKeys.list(params),
    queryFn: () => getClasses(params),
    placeholderData: (prev) => prev,
  })

export const useClassById = (id: number) =>
  useQuery({
    queryKey: classQueryKeys.detail(id),
    queryFn: () => getClassById(id),
    enabled: id > 0,
  })

export const useBranchesForClass = () =>
  useQuery({
    queryKey: classQueryKeys.branches,
    queryFn: getBranchesForSelect,
    staleTime: 5 * 60 * 1000,
  })

export const useTeachersForClass = () =>
  useQuery({
    queryKey: classQueryKeys.teachers,
    queryFn: getTeachersForSelect,
    staleTime: 5 * 60 * 1000,
  })

export const useEnrolledCounts = (classIds: number[]) =>
  useQuery({
    queryKey: classQueryKeys.enrolledCounts(classIds),
    queryFn: () => getEnrolledCounts(classIds),
    enabled: classIds.length > 0,
    staleTime: 60 * 1000,
  })

export const useCreateClass = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: ClassFormValues) => createClass(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stimulation-classes'] })
      toast.success('Clase creada exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear la clase: ${error.message}`)
    },
  })
}

export const useUpdateClass = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: ClassFormValues }) =>
      updateClass(id, values),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['stimulation-classes'] })
      queryClient.setQueryData(classQueryKeys.detail(updated.id), updated)
      toast.success('Clase actualizada exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar la clase: ${error.message}`)
    },
  })
}

export const useDeleteClass = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stimulation-classes'] })
      toast.success('Clase eliminada.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar la clase: ${error.message}`)
    },
  })
}
