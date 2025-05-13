// src/components/ui/reviews/ReviewItem.tsx
'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import { FaUserAlt, FaTimes } from 'react-icons/fa';
import { Rating } from 'react-simple-star-rating';
import { useAuth } from '@/src/hooks/useAuth';
import toast from 'react-hot-toast';
import { ReviewService } from '@/src/assets/styles/services/review.service';
import { IReview } from '@/src/types/review.intefrace';

// Интерфейс для вложенного объекта user, который есть в IReview и, СКОРЕЕ ВСЕГО, в твоем IInitialState.user
interface UserData {
  user_id: number;
  name: string;
  email: string;
  avatar_path: string;
  // Добавь другие поля, если они есть в объекте пользователя
}

// Описываем структуру того, что возвращает useAuth() (т.е. твой IInitialState)
// Это ПРЕДПОЛОЖЕНИЕ, основанное на ошибке. Тебе нужно его проверить и адаптировать!
interface AuthStateFromRedux { // Раньше это было IInitialState (судя по ошибке)
  user: UserData | null; // Объект пользователя может быть null, если не авторизован
  isAdmin?: boolean; // Предполагаем, что isAdmin находится на верхнем уровне state.user
  isLoading?: boolean; // Часто есть в состоянии аутентификации
  // Добавь другие поля, которые есть в твоем state.user (IInitialState)
}

interface ReviewItemProps {
  review: IReview;
  onDeleteSuccess: (reviewId: number) => void;
}

const ReviewItem: FC<ReviewItemProps> = ({ review, onDeleteSuccess }) => {
  // Получаем весь объект состояния аутентификации из Redux
  const authState = useAuth() as AuthStateFromRedux | null; // Типизируем как AuthStateFromRedux

  // Извлекаем данные текущего пользователя и его админский статус
  const currentUserData = authState?.user; // Это объект UserData или null
  const isAdmin = authState?.isAdmin ?? false; // isAdmin будет true/false (false если undefined)

  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false); // Для отслеживания ошибки загрузки аватара

  const formattedDate = new Date(review.created_at).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Определяем, может ли текущий пользователь удалить этот отзыв:
  // 1. Объект пользователя должен существовать (currentUserData не null).
  // 2. ИЛИ он администратор (isAdmin === true).
  // 3. ИЛИ он автор этого отзыва (currentUserData.user_id === review.user.user_id).
  const canDelete = currentUserData && (isAdmin || currentUserData.user_id === review.user.user_id);

  const handleDelete = async () => {
    const reviewId = review.review_id;

    // Проверяем, что данные пользователя доступны
    if (!currentUserData) {
      toast.error("Действие недоступно: вы не авторизованы.");
      return;
    }

    if (!window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      return;
    }

    setIsDeleting(true);

    try {
      // Случай 1: Админ удаляет НЕ СВОЙ отзыв.
      if (isAdmin && currentUserData.user_id !== review.user.user_id) {
        await ReviewService.deleteAsAdmin(reviewId);
        toast.success('Отзыв успешно удален администратором!');
      }
      // Случай 2: Пользователь (админ или обычный) удаляет СВОЙ отзыв.
      else if (currentUserData.user_id === review.user.user_id) {
        await ReviewService.delete(reviewId);
        toast.success('Отзыв успешно удален!');
      }
      else {
        toast.error('У вас нет прав на удаление этого отзыва.');
        setIsDeleting(false);
        return;
      }
      onDeleteSuccess(reviewId);
    } catch (error: any) {
      console.error('Ошибка при удалении отзыва:', error);
      const message = error.response?.data?.message || error.message || 'Произошла ошибка при удалении.';
      if (error.response?.status === 403) {
           toast.error('Доступ запрещен: недостаточно прав для удаления.');
      } else if (error.response?.status === 400 && message.includes('only delete your own reviews')) {
           toast.error('Ошибка: вы можете удалять только свои отзывы.');
      } else if (error.response?.status === 404) {
           toast.error('Ошибка: отзыв не найден.');
      } else {
          toast.error(`Ошибка: ${message}`);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-while rounded-lg shadow-md p-6 mb-4 relative">
      {canDelete && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          aria-label="Удалить отзыв"
          title="Удалить отзыв"
        >
          {isDeleting ? (
            <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <FaTimes size={18} />
          )}
        </button>
      )}

      <div className="flex items-center mb-2">
        <div className="mr-3 w-10 h-10 flex-shrink-0 relative bg-gray-200 rounded-full border-2 border-primary overflow-hidden">
          {review.user.avatar_path && !imageError ? (
            <Image
              src={review.user.avatar_path}
              fill
              sizes="40px"
              alt={review.user.name || 'Аватар пользователя'}
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaUserAlt className="text-gray-500" size={22} />
            </div>
          )}
        </div>

        <div>
          <div className="font-medium text-gray-800">{review.user.name || 'Анонимный пользователь'}</div>
          <div className="text-gray-500 text-xs">{formattedDate}</div>
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
          fillColor="#FFB300"
          emptyColor="#E0E0E0"
        />
      </div>
      <div className="text-sm leading-relaxed text-gray-700 whilespace-pre-wrap">{review.comment}</div>
    </div>
  );
};

export default ReviewItem;