import axios from 'axios';
import Cookies from 'js-cookie';

import { ICategory } from '@/src/types/category.interface';
import { axiosClassic, instanse } from '../api/api.interceptor';
import { IReview } from '@/src/types/review.intefrace';

const REVIEWS = 'reviews';
type TypeData = {
  rating: number;
  comment: string;
};

export const ReviewService = {
  async getAll() {
    return instanse<IReview[]>({
      url: `/admin/${REVIEWS}`,
      method: 'GET',
    });
  },

  async getAvarageByProduct(productId: string | number) {
    return axiosClassic<number>({
      url: `${REVIEWS}/average/${productId}`,
      method: 'GET',
    });
  },

  async leave(productId: string | number, data: TypeData) {
    return instanse<IReview>({
      url: `${REVIEWS}/leave/${productId}`,
      method: 'POST',
      data,
    });
  },

  async delete(review_id: number) {
    return instanse({
      url: `${REVIEWS}/${review_id}`,
      method: 'DELETE',
    });
  },
};
