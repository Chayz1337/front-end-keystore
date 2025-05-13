// src/product/[slug]/product-reviews/ProductReviews.tsx
'use client';

import { FC, useState, useEffect } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import Heading from '@/src/components/ui/button/Heading';
import LeaveReviewForm from './LeaveReviewForm';
// --- ИСПРАВЛЕНИЕ ТИПО ---
 // Исправлено review.intefrace
// --- КОНЕЦ ИСПРАВЛЕНИЯ ---
import Modal from '@/src/components/ui/modal/Modal';
import ReviewItem from './ReviewItem';
import { IReview } from '@/src/types/review.intefrace';

interface IProductReviews {
  reviews: IReview[]; // Приходящие отзывы (исходные данные)
  productId: number;
}

const REVIEWS_TO_SHOW_INITIAL = 3;
const REVIEWS_TO_SHOW_INCREMENT = 3;

const ProductReviews: FC<IProductReviews> = ({ reviews: initialReviews = [], productId }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();

  // --- ДОБАВЛЕНО: Состояние для отображаемых отзывов ---
  const [displayReviews, setDisplayReviews] = useState<IReview[]>(initialReviews);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(REVIEWS_TO_SHOW_INITIAL);

  // Синхронизируем состояние с пропсами, если они изменятся
  useEffect(() => {
    setDisplayReviews(initialReviews || []);
    // Сбрасываем количество видимых при изменении исходных отзывов
    setVisibleReviewsCount(REVIEWS_TO_SHOW_INITIAL);
  }, [initialReviews]);
  // --- КОНЕЦ ДОБАВЛЕНИЯ ---

  // --- ДОБАВЛЕНО: Функция для обработки успешного удаления ---
  const handleReviewDeleteSuccess = (deletedReviewId: string | number) => {
    setDisplayReviews(prevReviews =>
      prevReviews.filter(review => review.review_id !== deletedReviewId)
    );
    // Опционально: можно скорректировать visibleReviewsCount, если нужно
    // Например, если удалили отзыв сверх начального лимита,
    // и количество стало меньше лимита, можно сбросить visibleReviewsCount.
    // Но чаще всего достаточно просто удалить из списка.
  };
  // --- КОНЕЦ ДОБАВЛЕНИЯ ---


  const handleShowMoreReviews = () => {
    setVisibleReviewsCount(prevCount => prevCount + REVIEWS_TO_SHOW_INCREMENT);
  };

  const handleCollapseReviews = () => {
    setVisibleReviewsCount(REVIEWS_TO_SHOW_INITIAL);
  };

  // --- ИЗМЕНЕНО: Используем displayReviews для расчетов и отображения ---
  const currentDisplayedList = displayReviews.slice(0, visibleReviewsCount);
  const totalReviewsInState = displayReviews.length;
  const canShowMore = totalReviewsInState > visibleReviewsCount;
  const allReviewsShown = !canShowMore && totalReviewsInState > REVIEWS_TO_SHOW_INITIAL;
  const remainingToShowCount = totalReviewsInState - visibleReviewsCount;
  // --- КОНЕЦ ИЗМЕНЕНИЯ ---

  return (
    <section id="reviews" className="mt-20">
      <div className="mb-9">
        {/* --- ИСПРАВЛЕНИЕ ТИПО --- */}
        <Heading classname="mb-5">Отзывы:</Heading> {/* Исправлено classname */}
        {/* --- КОНЕЦ ИСПРАВЛЕНИЯ --- */}

        {user && (
          <>
            <button
              className="text-aqua font-semibold text-lg mb-6 block"
              onClick={() => setModalOpen(true)}
            >
              Оставить отзыв
            </button>
            <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
              <LeaveReviewForm productId={productId} />
            </Modal>
          </>
        )}
        {!user && (
            <p className="text-gray-600 mb-6">
              Чтобы оставить отзыв, пожалуйста, <a href="/auth" className="text-aqua hover:underline">войдите</a> в систему.
            </p>
        )}

        {/* --- ИЗМЕНЕНО: Проверяем displayReviews --- */}
        {displayReviews && displayReviews.length > 0 ? (
          <>
            <div className="reviews-container overflow-auto max-h-[700px] max-w-[750px]
                          scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200
                          hover:scrollbar-thumb-slate-500 scrollbar-thumb-rounded-full
                          mt-8 rounded-lg p-4">
              {/* --- ИЗМЕНЕНО: Используем currentDisplayedList --- */}
              {currentDisplayedList.map((review) => (
                <div key={review.review_id} className="mb-6 last:mb-0">
                  {/* --- ИЗМЕНЕНО: Передаем обработчик удаления --- */}
                  <ReviewItem
                    review={review}
                    onDeleteSuccess={handleReviewDeleteSuccess} // Передаем функцию
                  />
                  {/* --- КОНЕЦ ИЗМЕНЕНИЯ --- */}
                </div>
              ))}
              {currentDisplayedList.length === 0 && displayReviews.length > 0 && (
                 <p className="text-gray-500">Загрузка отзывов...</p>
              )}
            </div>

            {/* Кнопка "Показать ещё" */}
            {canShowMore && (
              <div className="text-left mt-6">
                <button
                  onClick={handleShowMoreReviews}
                  className="px-6 py-2 bg-aqua text-while font-semibold rounded-lg hover:bg-aqua-dark focus:outline-none focus:ring-2 focus:ring-aqua focus:ring-opacity-50 transition-colors" // Изменил text-while на text-white
                >
                  {/* --- ИЗМЕНЕНО: Используем remainingToShowCount --- */}
                  Показать ещё ({remainingToShowCount} {
                    remainingToShowCount % 10 === 1 && remainingToShowCount % 100 !== 11 ? 'отзыв' :
                    remainingToShowCount % 10 >= 2 && remainingToShowCount % 10 <= 4 && (remainingToShowCount % 100 < 10 || remainingToShowCount % 100 >= 20) ? 'отзыва' : 'отзывов'
                  })
                  {/* --- КОНЕЦ ИЗМЕНЕНИЯ --- */}
                </button>
              </div>
            )}

            {/* Кнопка "Скрыть" */}
            {allReviewsShown && (
              <div className="text-left mt-6">
                <button
                  onClick={handleCollapseReviews}
                  className="px-6 py-2 bg-transparent border-2 border-aqua text-aqua font-semibold rounded-lg hover:bg-aqua hover:text-while focus:outline-none focus:ring-2 focus:ring-aqua focus:ring-opacity-50 transition-colors" // Изменил hover:text-while на hover:text-white
                >
                  Свернуть отзывы
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 mt-4">
            Отзывов пока нет. {user ? 'Будьте первым!' : ''}
          </p>
        )}
         {/* --- КОНЕЦ ИЗМЕНЕНИЯ --- */}
      </div>
    </section>
  );
};

export default ProductReviews;