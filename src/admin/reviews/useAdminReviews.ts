import { ReviewService } from '@/src/assets/styles/services/review.service';
import { IListItem } from '@/src/components/ui/admin/admin-list/admin-list.interface';
import { useQuery } from '@tanstack/react-query';

export const useAdminReviews = () => {
  const { data = [], isFetching, refetch } = useQuery({
    queryKey: ['get admin reviews'],
    queryFn: () => ReviewService.getAll(),
    select: ({ data }) =>
      data.map((review): IListItem => ({
        id: review.review_id,
        items: [
          Array.from({ length: review.rating }).map(() => '⭐').join(' '),
          review.comment,
          review.game.name,
        ],
      })),
  });

  return { data, isFetching, refetch };
};
