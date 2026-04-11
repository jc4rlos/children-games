import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getBranchesForSelect } from '@/features/branches/data/branches-service'
import { getCategoriesForSelect } from '@/features/product-categories/data/categories-service'
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  type ProductsParams,
  updateProduct,
} from '../data/products-service'
import type { ProductFormValues } from '../data/schema'

export const productQueryKeys = {
  list: (params: ProductsParams) => ['products', 'list', params] as const,
  detail: (id: number) => ['products', id] as const,
  forSelect: (branchId?: number) => ['products', 'select', branchId] as const,
  branches: ['products', 'branches'] as const,
  categories: ['products', 'categories'] as const,
}

export const useProducts = (params: ProductsParams) =>
  useQuery({
    queryKey: productQueryKeys.list(params),
    queryFn: () => getProducts(params),
    placeholderData: (prev) => prev,
  })

export const useProduct = (id: number) =>
  useQuery({
    queryKey: productQueryKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: id > 0,
  })

export const useBranchesForProduct = () =>
  useQuery({
    queryKey: productQueryKeys.branches,
    queryFn: getBranchesForSelect,
    staleTime: 5 * 60 * 1000,
  })

export const useCategoriesForProduct = () =>
  useQuery({
    queryKey: productQueryKeys.categories,
    queryFn: getCategoriesForSelect,
    staleTime: 5 * 60 * 1000,
  })

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: ProductFormValues) => createProduct(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Producto creado.')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear el producto: ${error.message}`)
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: ProductFormValues }) =>
      updateProduct(id, values),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.setQueryData(productQueryKeys.detail(updated.id), updated)
      toast.success('Producto actualizado.')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar el producto: ${error.message}`)
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Producto eliminado.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar el producto: ${error.message}`)
    },
  })
}
