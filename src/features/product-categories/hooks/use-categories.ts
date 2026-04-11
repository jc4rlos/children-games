import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  type CategoriesParams,
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategories,
  updateCategory,
} from '../data/categories-service'
import { type ProductCategoryFormValues } from '../data/schema'

export const categoryQueryKeys = {
  list: (params: CategoriesParams) =>
    ['product-categories', 'list', params] as const,
  detail: (id: number) => ['product-categories', id] as const,
  forSelect: () => ['product-categories', 'select'] as const,
}

export const useCategories = (params: CategoriesParams) =>
  useQuery({
    queryKey: categoryQueryKeys.list(params),
    queryFn: () => getCategories(params),
    placeholderData: (prev) => prev,
  })

export const useCategoryById = (id: number) =>
  useQuery({
    queryKey: categoryQueryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: id > 0,
  })

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: ProductCategoryFormValues) => createCategory(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] })
      toast.success('Categoría creada.')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear la categoría: ${error.message}`)
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number
      values: ProductCategoryFormValues
    }) => updateCategory(id, values),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] })
      queryClient.setQueryData(categoryQueryKeys.detail(updated.id), updated)
      toast.success('Categoría actualizada.')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar la categoría: ${error.message}`)
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] })
      toast.success('Categoría eliminada.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar la categoría: ${error.message}`)
    },
  })
}
