// src/components/ui/reviews/ReviewItem.tsx (или где он у вас находится)
'use client';

import { FC } from 'react';
import Image from 'next/image';
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
    <div className="bg-while dark:bg-while rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center mb-2">

        {/* === Блок Аватара === */}
        <div className="mr-3 w-10 h-10 flex-shrink-0"> {/* Контейнер 40x40 */}
          {review.user.avatar_path ? (
            <Image
              src={review.user.avatar_path}
              width={40}
              height={40}
              alt={review.user.name || 'Аватар пользователя'}
              // === ИЗМЕНЕНИЕ ЗДЕСЬ: Добавляем классы для обводки ===
              className="rounded-full object-cover w-full h-full border-2 border-primary dark:border-primary"
            />
          ) : (
            // Placeholder уже имеет обводку, оставляем как есть
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
              <FaUserAlt className="text-gray-500 dark:text-gray-400" size={24} />
            </div>
          )}
        </div>
        {/* === Конец Блока Аватара === */}

        {/* Информация о пользователе */}
        <div>
          <div className="font-medium dark:text-black">{review.user.name || 'Анонимный пользователь'}</div>
          <div className="text-gray-400 dark:text-gray-500 text-xs">{formattedDate}</div>
        </div>
      </div>

      {/* Рейтинг */}
      <div className="flex items-center mb-4">
        <Rating
          readonly
          initialValue={review.rating}
          SVGstyle={{ display: 'inline-block' }}
          size={20}
          allowFraction
          transition
          fillColor="#FFB300"
          emptyColor="#E0E0E0"
        />
      </div>

      {/* Текст комментария */}
      <div className="text-sm leading-relaxed dark:text-black">{review.comment}</div>
    </div>
  );
};

export default ReviewItem;