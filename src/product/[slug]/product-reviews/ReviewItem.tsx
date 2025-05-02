import { FC } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { Rating } from 'react-simple-star-rating';
import { IReview } from '@/src/types/review.intefrace';

const ReviewItem: FC<{ review: IReview }> = ({ review }) => {
  const formattedDate = new Date(review.created_at).toLocaleDateString('ru-RU', {
    day:   '2-digit',
    month: 'long',
    year:  'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-2">
        <div className="mr-3">
          <FaUserAlt size={40} className="text-gray-500" />
        </div>
        <div>
          <div className="font-medium">{review.user.email}</div>
          <div className="text-gray-400 text-xs">{formattedDate}</div>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <Rating
          readonly
          initialValue={review.rating}
          SVGstyle={{ display: 'inline-block' }}
          size={20}
          allowFraction
          transition
        />
      </div>

      <div className="text-sm leading-relaxed">{review.comment}</div>
    </div>
  );
};

export default ReviewItem;
