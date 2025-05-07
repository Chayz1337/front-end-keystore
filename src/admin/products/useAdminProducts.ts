// src/pages/admin/products/useAdminProducts.ts
import { ProductService } from '@/src/assets/styles/services/product/product.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { IListItem } from '@/src/components/ui/admin/admin-list/admin-list.interface';

export const useAdminProducts = () => {
  const { data = [], isFetching, refetch } = useQuery({
    queryKey: ['get admin games'],
    queryFn: () => ProductService.getAll(),
    select: (payload) => {
      return payload.games.map((game) => ({
        id: game.game_id,
        viewUrl: `/games/${game.slug}`,
        editUrl: `/admin/games/edit/${game.game_id}`,
        items: [
          game.name,
          `Ключей: ${game.stock}`,
          game.game_categories.map((cat) => cat.category.category_name).join(', '),
        ]
      }));
    }
  });

  const { mutate } = useMutation({
    mutationFn: (id: number) => ProductService.delete(id), // Удаление через сервис
    onSuccess: () => {
      refetch(); // Перезагружаем данные после успешного удаления
    },
    onError: (error) => {
      console.error("Ошибка при удалении игры:", error);
    },
  });

  return { data, isFetching, mutate };  // Возвращаем mutate для использования в компоненте
};
