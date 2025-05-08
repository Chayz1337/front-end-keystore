// src/pages/admin/products/useAdminProducts.ts
import { ProductService } from '@/src/assets/styles/services/product/product.service';
import { TypePaginationProducts, IProduct } from '@/src/types/product.interface'; // Добавили IProduct
import { useMutation, useQuery, UseMutateFunction, QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { IListItem } from '@/src/components/ui/admin/admin-list/admin-list.interface';

interface UseAdminProductsResult {
    data: IListItem[];
    isFetching: boolean;
    mutate: UseMutateFunction<any, Error, number, unknown>;
    // Указываем тип refetch более точно на основе useQuery
    refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<IListItem[], Error>>;
}

export const useAdminProducts = (): UseAdminProductsResult => {
  const { data: queryData, isFetching, refetch } = useQuery<
    TypePaginationProducts, // Тип данных от queryFn
    Error,                 // Тип ошибки
    IListItem[]            // Тип данных после select
    >({
        queryKey: ['get admin games'],
        queryFn: () => ProductService.getAll(), // Ожидаем Promise<TypePaginationProducts>
        select: (payload) => {
            console.log('useAdminProducts select: Raw payload:', payload);
            return (payload?.games || []).map((game): IListItem => ({
                id: game.game_id,
                viewUrl: `/games/${game.slug}`,
                editUrl: `/admin/games/edit/${game.game_id}`,
                items: [
                game.name || 'Без имени',
                `Ключей: ${game.stock ?? 0}`,
                (game.game_categories || []).map(gc => gc?.category?.category_name).filter(Boolean).join(', ') || 'Без категорий',
                // Важно: сохраняем ссылку на оригинальный объект игры, если он нужен для редактирования
                // чтобы не делать лишний запрос в handleEditGameClicked
                // originalGameData: game // Раскомментируй, если хочешь передавать полные данные сразу
                ]
            }));
        }
    });

  const data = queryData || [];

  const { mutate } = useMutation({
    mutationFn: (id: number) => ProductService.delete(id),
    onSuccess: () => {
      console.log('Game deleted, refetching admin games list...');
      refetch(); 
    },
    onError: (error) => {
      console.error("Ошибка при удалении игры:", error);
    },
  });

  return { 
      data, 
      isFetching, 
      mutate, 
      // Убеждаемся, что refetch возвращается
      refetch: refetch as (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<IListItem[], Error>> 
    };
};