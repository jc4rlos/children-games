import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getBranchesForSelect } from '@/features/branches/data/branches-service'
import {
  type CouponsParams,
  createCoupon,
  deleteCoupon,
  getCouponById,
  getCoupons,
  updateCoupon,
} from '../data/coupons-service'
import { type CouponFormValues } from '../data/schema'

export const couponQueryKeys = {
  list: (params: CouponsParams) => ['coupons', 'list', params] as const,
  detail: (id: number) => ['coupons', id] as const,
  branches: ['coupons', 'branches'] as const,
}

export const useCoupons = (params: CouponsParams) =>
  useQuery({
    queryKey: couponQueryKeys.list(params),
    queryFn: () => getCoupons(params),
    placeholderData: (prev) => prev,
  })

export const useCoupon = (id: number) =>
  useQuery({
    queryKey: couponQueryKeys.detail(id),
    queryFn: () => getCouponById(id),
    enabled: id > 0,
  })

export const useBranchesForCoupon = () =>
  useQuery({
    queryKey: couponQueryKeys.branches,
    queryFn: getBranchesForSelect,
    staleTime: 5 * 60 * 1000,
  })

export const useCreateCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: CouponFormValues) => createCoupon(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      toast.success('Cupón creado exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear el cupón: ${error.message}`)
    },
  })
}

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: CouponFormValues }) =>
      updateCoupon(id, values),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      queryClient.setQueryData(couponQueryKeys.detail(updated.id), updated)
      toast.success('Cupón actualizado exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar el cupón: ${error.message}`)
    },
  })
}

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      toast.success('Cupón eliminado.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar el cupón: ${error.message}`)
    },
  })
}
