// src/product/[slug]/product-reviews/ProductReviews.tsx

import { FC, useState } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import Heading from '@/src/components/ui/button/Heading';
import LeaveReviewForm from './LeaveReviewForm';
import { IReview } from '@/src/types/review.intefrace';
import Modal from '@/src/components/ui/modal/Modal';
import ReviewItem from './ReviewItem';

interface IProductReviews {
  reviews: IReview[];
  productId: number;
}

const ProductReviews: FC<IProductReviews> = ({ reviews, productId }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();

  if (!reviews.length) return null;

  return (
    <section id="reviews" className="mt-20">
      <div className="mb-9">
        <Heading classname="mb-5">Отзывы</Heading>

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

        {/* Контейнер для прокрутки отзывов */}
        <div className="reviews-container overflow-auto max-h-[700px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-8 rounded-lg p-4">
          {reviews.map((review) => (
            <div key={review.review_id} className="mb-6 last:mb-0">
              <ReviewItem review={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
