import axios from 'axios';
import Cookies from 'js-cookie';

import { axiosClassic, instanse } from '../../api/api.interceptor';
import { IProduct, TypePaginationProducts } from '@/src/types/product.interface';
import { PRODUCTS, TypeProductDataFilters, TypeProductData } from './product.types';

export const ProductService = {
  /**
   * Получает список продуктов с возможностью фильтрации и пагинации.
   */
  async getAll(queryData = {} as TypeProductDataFilters): Promise<TypePaginationProducts> {
    console.log('ProductService.getAll: Запрос с параметрами:', queryData);
    const { data } = await axiosClassic<TypePaginationProducts>({
      url: `/${PRODUCTS}`,
      method: 'GET',
      params: queryData,
    });
    console.log('ProductService.getAll: Получен ответ:', data);
    return data;
  },

  /**
   * Получает список похожих продуктов.
   */
  async getSimilar(id: string | number): Promise<IProduct[]> {
    const { data } = await axiosClassic<IProduct[]>({
      url: `/${PRODUCTS}/similar/${id}`,
      method: 'GET',
    });
    return data;
  },

  /**
   * Получает продукт по его slug.
   */
  async getBySlug(slug: string): Promise<IProduct[]> {
    const { data } = await axiosClassic<IProduct[]>({
      url: `/${PRODUCTS}/by-slug/${slug}`,
      method: 'GET',
    });
    return data;
  },

  /**
   * Получает список продуктов по slug категории.
   */
  async getByCategory(categorySlug: string | number): Promise<IProduct[]> {
    const { data } = await axiosClassic<IProduct[]>({
      url: `/${PRODUCTS}/by-category/${categorySlug}`,
      method: 'GET',
    });
    return data;
  },

  /**
   * Получает продукт по его ID.
   */
  async getById(id: string | number): Promise<IProduct> {
    const { data } = await instanse<IProduct>({
      url: `/${PRODUCTS}/${id}`,
      method: 'GET',
    });
    return data;
  },

  /**
   * Запрашивает защищённый админ-эндпоинт и возвращает массив ключей игры.
   */
  async getGameKeys(gameId: number): Promise<{ key_id: number; is_used: boolean }[]> {
    console.log(`ProductService.getGameKeys: Запрос ключей для игры ID: ${gameId}`);
    const { data } = await instanse<{ key_id: number; is_used: boolean }[]>({
      url: `/admin/game-keys/${gameId}`,
      method: 'GET',
    });
    console.log(`ProductService.getGameKeys: Получены ключи для игры ID: ${gameId}`, data);
    return data;
  },

  /**
   * Подсчитывает число доступных ключей для игры.
   */
  async getAvailableKeysCount(gameId: number): Promise<number> {
    const keys = await this.getGameKeys(gameId);
    const availableCount = keys.filter(k => !k.is_used).length;
    console.log(`ProductService.getAvailableKeysCount: Доступно ключей для игры ID ${gameId}: ${availableCount}`);
    return availableCount;
  },

  /**
   * Создает новый продукт (игру) через защищенный эндпоинт.
   */
  async create(data: TypeProductData): Promise<IProduct> {
    console.log('ProductService.create: Отправка данных:', data);
    const { data: created } = await instanse<IProduct>({
      url: `/admin/${PRODUCTS}`,
      method: 'POST',
      data,
    });
    console.log('ProductService.create: Получен ответ:', created);
    return created;
  },

  /**
   * Обновляет существующий продукт (игру) через защищенный эндпоинт.
   */
  async update(id: string | number, data: TypeProductData): Promise<IProduct> {
    console.log(`ProductService.update: Отправка данных для ID: ${id}:`, data);
    const { data: updated } = await instanse<IProduct>({
      url: `/admin/${PRODUCTS}/${id}`,
      method: 'PATCH',
      data,
    });
    console.log(`ProductService.update: Получен ответ для ID: ${id}:`, updated);
    return updated;
  },

  /**
   * Удаляет продукт (игру) через защищенный эндпоинт.
   */
  async delete(id: number): Promise<any> {
    console.log(`ProductService.delete: Запрос на удаление ID: ${id}`);
    const { data } = await instanse({
      url: `/admin/${PRODUCTS}/${id}`,
      method: 'DELETE',
    });
    console.log(`ProductService.delete: Ответ для ID: ${id}:`, data);
    return data;
  },
};
