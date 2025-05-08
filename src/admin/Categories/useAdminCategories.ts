// src/pages/admin/categories/useAdminCategories.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { CategoryService } from '@/src/assets/styles/services/category.service';
import { IListItem } from '@/src/components/ui/admin/admin-list/admin-list.interface';
import { getAdminUrl } from '@/src/config/url.config';

export const useAdminCategories = () => {
  const { data = [], isFetching, refetch } = useQuery({
    queryKey: ['get admin categories'],
    queryFn: () => CategoryService.getAll(),
    select: ({ data }) =>
      data.map((category): IListItem => ({
        id: category.category_id,
        viewUrl: `/category/${category.slug}`,
        editUrl: getAdminUrl(`/categories/${category.category_id}`),
        items: [category.category_name, category.slug],
      })),
  });

  const { mutate } = useMutation({
    mutationFn: (id: number) => CategoryService.delete(id),
    onSuccess: () => {
      refetch();
    },
  });

  return { data, isFetching, refetch, mutate };
};
