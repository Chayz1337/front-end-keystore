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
          <Heading classname="mb-3">Отзывы</Heading>
  
          {user && (
            <>
              <button className="text-aqua" onClick={() => setModalOpen(true)}>
                Оставить отзыв
              </button>
  
              <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
                <LeaveReviewForm productId={productId} />
              </Modal>
            </>
          )}
  
          <div className="grid grid-cols-4 gap-10 mt-8">
            {reviews.map((review) => (
              <ReviewItem key={review.review_id} review={review} />
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default ProductReviews;
  
