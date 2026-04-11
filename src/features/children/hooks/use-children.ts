import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  type ChildrenParams,
  createChild,
  deleteChild,
  getChildById,
  getChildren,
  updateChild,
  getBranchesForSelect,
} from '../data/children-service'
import { type ChildFormValues } from '../data/schema'

export const childQueryKeys = {
  list: (params: ChildrenParams) => ['children', 'list', params] as const,
  detail: (id: number) => ['children', id] as const,
  branches: ['children', 'branches'] as const,
}

export const useChildren = (params: ChildrenParams) =>
  useQuery({
    queryKey: childQueryKeys.list(params),
    queryFn: () => getChildren(params),
    placeholderData: (prev) => prev,
  })

export const useChild = (id: number) =>
  useQuery({
    queryKey: childQueryKeys.detail(id),
    queryFn: () => getChildById(id),
    enabled: id > 0,
  })

export const useBranchesForChild = () =>
  useQuery({
    queryKey: childQueryKeys.branches,
    queryFn: getBranchesForSelect,
    staleTime: 5 * 60 * 1000,
  })

export const useCreateChild = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: ChildFormValues) => createChild(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] })
      toast.success('Niño registrado exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al registrar al niño: ${error.message}`)
    },
  })
}

export const useUpdateChild = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: ChildFormValues }) =>
      updateChild(id, values),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['children'] })
      queryClient.setQueryData(childQueryKeys.detail(updated.id), updated)
      toast.success('Datos del niño actualizados.')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar al niño: ${error.message}`)
    },
  })
}

export const useDeleteChild = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteChild(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] })
      toast.success('Niño eliminado.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar al niño: ${error.message}`)
    },
  })
}
