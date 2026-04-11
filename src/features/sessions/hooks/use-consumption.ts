import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getProductsForSelect } from '@/features/products/data/products-service'
import {
  addSessionConsumption,
  getSessionConsumptions,
  removeSessionConsumption,
  type AddConsumptionPayload,
} from '../data/consumption-service'

export const consumptionQueryKeys = {
  list: (sessionId: number) => ['consumption', sessionId] as const,
  products: (branchId?: number) =>
    ['consumption', 'products', branchId] as const,
}

export const useSessionConsumptions = (sessionId: number | null) =>
  useQuery({
    queryKey: consumptionQueryKeys.list(sessionId ?? 0),
    queryFn: () => getSessionConsumptions(sessionId!),
    enabled: (sessionId ?? 0) > 0,
  })

export const useProductsForConsumption = (branchId?: number) =>
  useQuery({
    queryKey: consumptionQueryKeys.products(branchId),
    queryFn: () => getProductsForSelect(branchId),
    staleTime: 5 * 60_000,
  })

export const useAddConsumption = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AddConsumptionPayload) =>
      addSessionConsumption(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: consumptionQueryKeys.list(payload.playSessionId),
      })
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Producto agregado a la sesión.')
    },
    onError: (error: Error) => {
      toast.error(`Error al agregar producto: ${error.message}`)
    },
  })
}

export const useRemoveConsumption = (sessionId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => removeSessionConsumption(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: consumptionQueryKeys.list(sessionId),
      })
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Producto eliminado de la sesión.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar: ${error.message}`)
    },
  })
}
