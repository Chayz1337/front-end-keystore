// src/product/[slug]/product-reviews/ProductReviews.tsx
import { FC, useState, useEffect } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import Heading from '@/src/components/ui/button/Heading';
import LeaveReviewForm from './LeaveReviewForm';
import { IReview } from '@/src/types/review.intefrace'; // Убедитесь, что имя файла .interface
import Modal from '@/src/components/ui/modal/Modal';
import ReviewItem from './ReviewItem';

interface IProductReviews {
  reviews: IReview[];
  productId: number;
}

const REVIEWS_TO_SHOW_INITIAL = 3;
const REVIEWS_TO_SHOW_INCREMENT = 3;

const ProductReviews: FC<IProductReviews> = ({ reviews = [], productId }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(REVIEWS_TO_SHOW_INITIAL);

  useEffect(() => {
    setVisibleReviewsCount(REVIEWS_TO_SHOW_INITIAL);
  }, [reviews]);

  const handleShowMoreReviews = () => {
    setVisibleReviewsCount(prevCount => prevCount + REVIEWS_TO_SHOW_INCREMENT);
  };

  const handleCollapseReviews = () => {
    setVisibleReviewsCount(REVIEWS_TO_SHOW_INITIAL);
    // Опционально: прокрутить пользователя к началу списка отзывов, если он длинный
    // const reviewsSection = document.getElementById('reviews');
    // if (reviewsSection) {
    //   reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // }
  };

  const displayedReviews = reviews.slice(0, visibleReviewsCount);
  const canShowMore = reviews.length > visibleReviewsCount;
  const allReviewsShown = !canShowMore && reviews.length > REVIEWS_TO_SHOW_INITIAL;

  return (
    <section id="reviews" className="mt-20">
      <div className="mb-9">
        <Heading classname="mb-5">Отзывы:</Heading> {/* Оставил classname и IReview с опечаткой как просили */}

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

        {reviews && reviews.length > 0 ? (
          <>
            <div className="reviews-container overflow-auto max-h-[700px] max-w-[750px] 
                          scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200 
                          hover:scrollbar-thumb-slate-500 scrollbar-thumb-rounded-full 
                          mt-8 rounded-lg p-4">
              {displayedReviews.map((review) => (
                <div key={review.review_id} className="mb-6 last:mb-0">
                  <ReviewItem review={review} />
                </div>
              ))}
              {displayedReviews.length === 0 && reviews.length > 0 && (
                 <p className="text-gray-500">Загрузка отзывов...</p>
              )}
            </div>

            {/* Кнопка "Показать ещё" */}
            {canShowMore && (
              // Изменяем text-center на text-left
              <div className="text-left mt-6"> 
                <button
                  onClick={handleShowMoreReviews}
                  className="px-6 py-2 bg-aqua text-while font-semibold rounded-lg hover:bg-aqua-dark focus:outline-none focus:ring-2 focus:ring-aqua focus:ring-opacity-50 transition-colors"
                >
                  Показать ещё ({reviews.length - visibleReviewsCount} {
                    (reviews.length - visibleReviewsCount) % 10 === 1 && (reviews.length - visibleReviewsCount) % 100 !== 11 ? 'отзыв' :
                    (reviews.length - visibleReviewsCount) % 10 >= 2 && (reviews.length - visibleReviewsCount) % 10 <= 4 && ((reviews.length - visibleReviewsCount) % 100 < 10 || (reviews.length - visibleReviewsCount) % 100 >= 20) ? 'отзыва' : 'отзывов'
                  })
                </button>
              </div>
            )}

            {/* Кнопка "Скрыть" */}
            {allReviewsShown && (
              <div className="text-left mt-6"> 
                <button
                  onClick={handleCollapseReviews}
                  className="px-6 py-2 bg-transparent border-2 border-aqua text-aqua font-semibold rounded-lg hover:bg-aqua hover:text-while focus:outline-none focus:ring-2 focus:ring-aqua focus:ring-opacity-50 transition-colors"
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
      </div>
    </section>
  );
};

export default ProductReviews;