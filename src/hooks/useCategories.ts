import { useQuery } from '@tanstack/react-query'

import { ICategory } from '@/src/types/category.interface'
import { CategoryService } from '../assets/styles/services/category.service'

export const useCategories = () => {
  return useQuery<ICategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await CategoryService.getAll()
      return response.data // важно: возвращаем data, а не весь response
    },
    staleTime: 1000 * 60 * 5,
  })
}
export type { ICategory } from '@/src/types/category.interface'

