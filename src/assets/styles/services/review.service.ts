// src/assets/styles/services/review.service.ts
import axios from 'axios'; // Убери, если не используется напрямую (axiosClassic может быть не нужен)
import Cookies from 'js-cookie'; // Убери, если не используется напрямую

import { ICategory } from '@/src/types/category.interface'; // Кажется, ICategory здесь не используется
import { axiosClassic, instanse } from '../api/api.interceptor'; // Убедись, что путь правильный
import { IReview } from '@/src/types/review.intefrace'; // Убедись, что путь правильный

const REVIEWS = 'reviews';
type TypeData = {
  rating: number;
  comment: string;
};

export const ReviewService = {
  // Этот метод, вероятно, для админ-панели, для получения ВСЕХ отзывов.
  // Если это так, имя может быть более говорящим, например, getAllForAdmin
  async getAll() {
    return instanse<IReview[]>({
      // Предполагаю, что для админа эндпоинт для получения ВСЕХ отзывов может быть таким:
      // url: `/admin/${REVIEWS}`,
      // Или если он общий, но с проверкой прав на бэке:
      url: `/admin/${REVIEWS}`, // Или как у тебя на бэкенде для получения всех отзывов (возможно, с пагинацией)
      method: 'GET',
    });
  },

  async getAverageByProduct(productId: string | number) { // productId -> game_id, если речь об играх
    return axiosClassic<number>({ // Используй instanse если этот эндпоинт требует аутентификации или спец. заголовков
      url: `${REVIEWS}/average/${productId}`, // productId -> game_id
      method: 'GET',
    });
  },

  async leave(productId: string | number, data: TypeData) { // productId -> game_id
    return instanse<IReview>({
      url: `${REVIEWS}/leave/${productId}`, // productId -> game_id
      method: 'POST',
      data,
    });
  },

  // Метод для удаления отзыва пользователем (своего отзыва)
  async delete(review_id: number) {
    return instanse({
      url: `${REVIEWS}/${review_id}`,
      method: 'DELETE',
    });
  },

  // НОВЫЙ МЕТОД: Удаление отзыва администратором
  // Предполагаем, что эндпоинт для админа /admin/reviews/:review_id
  // Если эндпоинт тот же, но бэк проверяет роль, то этот отдельный метод не нужен.
  // Уточни, какой эндпоинт на бэке для админского удаления.
  // Если бэк сам разруливает права на `DELETE /reviews/:review_id`, то этот метод избыточен.
  async deleteAsAdmin(review_id: number) {
    // Пример, если эндпоинт для админа /admin/reviews/delete/:review_id или похожий
    // У тебя в ReviewController есть deleteReviewAdmin, который доступен по @Auth('ADMIN')
    // и принимает review_id. URL этого эндпоинта нужно уточнить.
    // Если это DELETE /admin/reviews/:review_id
    return instanse({
      url: `/admin/${REVIEWS}/${review_id}`, // <-- ПРОВЕРЬ ЭТОТ URL! Он должен совпадать с твоим контроллером
      method: 'DELETE',
    });
  },
};