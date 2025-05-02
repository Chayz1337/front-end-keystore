import { CategoryService } from './../../assets/styles/services/category.service';
import { IListItem } from '@/src/components/ui/admin/admin-list/admin-list.interface';
import { getAdminUrl } from '@/src/config/url.config';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useAdminCategories = () => {
  const { data = [], isFetching, refetch } = useQuery({
    queryKey: ['get admin categories'],
    queryFn: () => CategoryService.getAll(),
    select: ({ data }) =>
      data.map((category): IListItem => ({
        id: category.category_id,
        viewUrl: `/category/${category.slug}`,
        editUrl: getAdminUrl(`/categories/edit/${category.category_id}`),
        items: [
          category.category_name,
          category.slug, // исправлено: просто строка, не нужно .map()
        ],
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
