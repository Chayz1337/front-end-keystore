// src/product/[slug]/product-reviews/ProductReviews.tsx
import { FC, useState } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import Heading from '@/src/components/ui/button/Heading'; // Убедись, что путь к Heading верный
import LeaveReviewForm from './LeaveReviewForm';
import { IReview } from '@/src/types/review.intefrace'; // Проверь имя файла интерфейса (intefrace -> interface)
import Modal from '@/src/components/ui/modal/Modal';
import ReviewItem from './ReviewItem';

interface IProductReviews {
  reviews: IReview[];
  productId: number;
}

const ProductReviews: FC<IProductReviews> = ({ reviews = [], productId }) => { // Добавил значение по умолчанию для reviews
  const [isModalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();

  // Убираем ранний выход: if (!reviews.length) return null;
  // Компонент теперь будет рендериться всегда,
  // а отображение списка отзывов или сообщения "нет отзывов" будет условным.

  return (
    <section id="reviews" className="mt-20">
      <div className="mb-9">
        <Heading classname="mb-5">Отзывы:</Heading> {/* Изменил на Отзывы: для ясности */}

        {/* Кнопка "Оставить отзыв" и модальное окно с формой */}
        {/* Отображаются, если пользователь авторизован */}
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


        {/* Отображение списка отзывов или сообщения об их отсутствии */}
        {reviews && reviews.length > 0 ? (
          <div className="reviews-container overflow-auto max-h-[700px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-8 rounded-lg p-4">
            {reviews.map((review) => (
              <div key={review.review_id} className="mb-6 last:mb-0">
                <ReviewItem review={review} />
              </div>
            ))}
          </div>
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