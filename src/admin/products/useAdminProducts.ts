// admin/products/useAdminProducts.ts
import { ProductService } from '@/src/assets/styles/services/product/product.service';
import { IListItem } from '@/src/components/ui/admin/admin-list/admin-list.interface';
import { getAdminUrl } from '@/src/config/url.config';
import { TypePaginationProducts } from '@/src/types/product.interface';
import { formatDate } from '@/src/utils/format-date';  // Ваша функция
import { useMutation, useQuery } from '@tanstack/react-query';

export const useAdminProducts = () => {
  // Используем useQuery с дефолтным значением data = []
  const { data = [], isFetching, refetch } = useQuery<
    TypePaginationProducts, // Тип ответа от API
    Error, // Тип ошибки
    IListItem[] // Тип данных, которые будут возвращаться
  >({
    queryKey: ['get admin games'],
    queryFn: () => ProductService.getAll(),
    select: (payload) => {
      return payload.games.map((game) => {
        return {
          id: game.game_id,
          viewUrl: `/games/${game.slug}`,
          editUrl: getAdminUrl(`/games/edit/${game.game_id}`),
          items: [
            game.name,
            game.game_categories
              .map((cat) => cat.category.category_name)
              .join(', '),
            formatDate(game.created_at), // Обрабатываем строку с датой с помощью вашей функции
          ],
        };
      });
    },
  });

  // Мутация для удаления
  const { mutate } = useMutation({
    mutationFn: (id: number) => ProductService.delete(id),
    onSuccess: () => {
      refetch(); // Перезагружаем данные после успешного удаления
    },
  });

  return { data, isFetching, refetch, mutate };
};
