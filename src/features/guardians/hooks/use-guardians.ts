import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createGuardian,
  deleteGuardian,
  type GuardiansParams,
  getGuardianById,
  getGuardians,
  updateGuardian,
} from '../data/guardians-service'
import type { GuardianFormValues } from '../data/schema'

export const guardianQueryKeys = {
  list: (params: GuardiansParams) => ['guardians', 'list', params] as const,
  detail: (id: number) => ['guardians', id] as const,
}

export const useGuardians = (params: GuardiansParams) =>
  useQuery({
    queryKey: guardianQueryKeys.list(params),
    queryFn: () => getGuardians(params),
    placeholderData: (prev) => prev,
  })

export const useGuardian = (id: number) =>
  useQuery({
    queryKey: guardianQueryKeys.detail(id),
    queryFn: () => getGuardianById(id),
    enabled: id > 0,
  })

export const useCreateGuardian = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: GuardianFormValues) => createGuardian(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardians'] })
      toast.success('Apoderado creado exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear el apoderado: ${error.message}`)
    },
  })
}

export const useUpdateGuardian = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: GuardianFormValues }) =>
      updateGuardian(id, values),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['guardians'] })
      queryClient.setQueryData(guardianQueryKeys.detail(updated.id), updated)
      toast.success('Apoderado actualizado exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar el apoderado: ${error.message}`)
    },
  })
}

export const useDeleteGuardian = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteGuardian(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardians'] })
      toast.success('Apoderado eliminado.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar el apoderado: ${error.message}`)
    },
  })
}
