import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getBranchesForSelect } from '@/features/branches/data/branches-service'
import {
  type PricingParams,
  createPricingConfig,
  deletePricingConfig,
  getPricingConfigById,
  getPricingConfigs,
  updatePricingConfig,
} from '../data/pricing-service'
import { type PricingConfigFormValues } from '../data/schema'

export const pricingQueryKeys = {
  list: (params: PricingParams) => ['pricing', 'list', params] as const,
  detail: (id: number) => ['pricing', id] as const,
  branches: ['pricing', 'branches'] as const,
}

export const usePricingConfigs = (params: PricingParams) =>
  useQuery({
    queryKey: pricingQueryKeys.list(params),
    queryFn: () => getPricingConfigs(params),
    placeholderData: (prev) => prev,
  })

export const usePricingConfig = (id: number) =>
  useQuery({
    queryKey: pricingQueryKeys.detail(id),
    queryFn: () => getPricingConfigById(id),
    enabled: id > 0,
  })

export const useBranchesForPricing = () =>
  useQuery({
    queryKey: pricingQueryKeys.branches,
    queryFn: getBranchesForSelect,
    staleTime: 5 * 60 * 1000,
  })

export const useCreatePricingConfig = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: PricingConfigFormValues) => createPricingConfig(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing'] })
      toast.success('Configuración de precio creada.')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear la configuración: ${error.message}`)
    },
  })
}

export const useUpdatePricingConfig = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: PricingConfigFormValues }) =>
      updatePricingConfig(id, values),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['pricing'] })
      queryClient.setQueryData(pricingQueryKeys.detail(updated.id), updated)
      toast.success('Configuración de precio actualizada.')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar la configuración: ${error.message}`)
    },
  })
}

export const useDeletePricingConfig = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePricingConfig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing'] })
      toast.success('Configuración eliminada.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar la configuración: ${error.message}`)
    },
  })
}
