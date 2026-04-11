import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getBranchesForSelect } from '@/features/branches/data/branches-service'
import { decrementFreeSession } from '@/features/loyalty/data/loyalty-service'
import { loyaltyQueryKeys } from '@/features/loyalty/hooks/use-loyalty'
import type { PlaySession, SessionFormValues } from '../data/schema'
import {
  closeSession,
  createSession,
  getChildrenForSessionPicker,
  getCouponsForBranch,
  getEmployeesForSelect,
  getPricingConfigsForBranch,
  getSessions,
  type SessionsParams,
} from '../data/sessions-service'

export const sessionQueryKeys = {
  list: (params: SessionsParams) => ['sessions', 'list', params] as const,
  detail: (id: number) => ['sessions', id] as const,
  branches: ['sessions', 'branches'] as const,
  employees: ['sessions', 'employees'] as const,
  pricing: (branchId: number) => ['sessions', 'pricing', branchId] as const,
  coupons: (branchId: number) => ['sessions', 'coupons', branchId] as const,
  children: (name: string, page: number) =>
    ['sessions', 'children', name, page] as const,
}

export const useSessions = (params: SessionsParams) =>
  useQuery({
    queryKey: sessionQueryKeys.list(params),
    queryFn: () => getSessions(params),
    placeholderData: (prev) => prev,
    refetchInterval: 30_000,
  })

export const useBranchesForSession = () =>
  useQuery({
    queryKey: sessionQueryKeys.branches,
    queryFn: getBranchesForSelect,
    staleTime: 5 * 60 * 1000,
  })

export const useEmployeesForSession = () =>
  useQuery({
    queryKey: sessionQueryKeys.employees,
    queryFn: getEmployeesForSelect,
    staleTime: 5 * 60 * 1000,
  })

export const usePricingConfigsForBranch = (branchId: number) =>
  useQuery({
    queryKey: sessionQueryKeys.pricing(branchId),
    queryFn: () => getPricingConfigsForBranch(branchId),
    enabled: branchId > 0,
    staleTime: 5 * 60 * 1000,
  })

export const useCouponsForBranch = (branchId: number) =>
  useQuery({
    queryKey: sessionQueryKeys.coupons(branchId),
    queryFn: () => getCouponsForBranch(branchId),
    enabled: branchId > 0,
    staleTime: 5 * 60 * 1000,
  })

export const useChildrenForPicker = (name: string, page: number) =>
  useQuery({
    queryKey: sessionQueryKeys.children(name, page),
    queryFn: () =>
      getChildrenForSessionPicker({ name: name || undefined, page }),
    placeholderData: (prev) => prev,
  })

export const useCreateSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: SessionFormValues) => {
      const session = await createSession(values)
      if (values.isFreeSession) {
        await decrementFreeSession(values.childId)
      }
      return session
    },
    onSuccess: (_, values) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      queryClient.invalidateQueries({
        queryKey: loyaltyQueryKeys.card(values.childId),
      })
      toast.success('Sesión iniciada.')
    },
    onError: (error: Error) => {
      toast.error(`Error al iniciar sesión: ${error.message}`)
    },
  })
}

export const useCloseSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (session: PlaySession) => closeSession(session),
    onSuccess: (_, session) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      queryClient.invalidateQueries({
        queryKey: loyaltyQueryKeys.card(session.childId),
      })
      if (session.isFreeSession) {
        toast.success('Sesión gratuita cerrada.')
      } else {
        toast.success(
          'Sesión cerrada. ¡Se agregó 1 sello a la tarjeta de fidelidad!'
        )
      }
    },
    onError: (error: Error) => {
      toast.error(`Error al cerrar la sesión: ${error.message}`)
    },
  })
}
