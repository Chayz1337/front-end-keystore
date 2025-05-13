// src/admin/reviews/useAdminReviews.ts
import { ReviewService } from '@/src/assets/styles/services/review.service';
import { IListItem } from '@/src/components/ui/admin/admin-list/admin-list.interface';
import { useQuery, useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { IReview } from '@/src/types/review.intefrace'; // Убедись, что IReview импортирован и обновлен

export const useAdminReviews = () => {
  const { data = [], isFetching, refetch } = useQuery<
    AxiosResponse<IReview[]>,
    Error,
    IListItem[],
    string[]
  >({
    queryKey: ['get admin reviews'],
    queryFn: () => ReviewService.getAll(),
    select: (response) => {
      const reviewsArray = response.data;
      if (!reviewsArray || !Array.isArray(reviewsArray)) {
        return [];
      }
      return reviewsArray.map((review): IListItem => {
        if (!review || !review.game || !review.user) { // <--- Добавлена проверка на review.user
          return {
            id: review?.review_id || Date.now(),
            items: ['Ошибка данных', 'N/A', 'N/A', 'N/A'], // Добавил плейсхолдер для имени пользователя
          };
        }
        return {
          id: review.review_id,
          items: [
            review.user.name || 'Неизвестный пользователь', // <--- ИМЯ ПОЛЬЗОВАТЕЛЯ
            review.rating && review.rating > 0
              ? Array.from({ length: Math.round(review.rating) }).map(() => '⭐').join(' ')
              : 'Нет рейтинга',
            review.comment || 'Нет комментария',
            review.game.name || 'Нет названия игры',
          ],
        };
      });
    },
  });

  const { 
    mutate, 
    isPending: isDeletePending,
    error: deleteError 
  }: UseMutationResult<AxiosResponse<any>, AxiosError<any>, number, unknown> = useMutation({
    mutationFn: (id: number) => ReviewService.deleteAsAdmin(id),
    onSuccess: () => {
      refetch();
    },
    onError: (error: AxiosError<any>) => {
      console.error('useAdminReviews: Error deleting review:', error);
      const errorMessage = error.response?.data?.message || error.message || "Произошла ошибка при удалении";
      alert(`Ошибка удаления: ${errorMessage}`);
    }
  });

  return { data, isFetching, refetch, mutate, isDeletePending, deleteError };
};