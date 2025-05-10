// Предполагаемый путь: src/assets/styles/services/product/product.service.ts
// или src/services/product.service.ts, или аналогичный

import axios from 'axios'; // Если используется напрямую где-то, иначе можно убрать, если все через interceptor
import Cookies from 'js-cookie'; // Если используется, но в предоставленном коде не видно прямого использования

import { axiosClassic, instanse } from '../../api/api.interceptor'; // Проверь путь!
import { IProduct, TypePaginationProducts } from '@/src/types/product.interface'; // Проверь путь!
import { PRODUCTS, TypeProductDataFilters, TypeProductData } from './product.types'; // Проверь путь!

/**
 * Интерфейс для объекта подсказки поиска.
 * Основан на том, что возвращает твой бэкенд эндпоинт `search-suggestions`.
 */
export interface ISearchSuggestion {
  name: string;
  image?: string; // Картинка может отсутствовать (game.images[0])
  price: number;
  slug: string;
}

export const ProductService = {
  /**
   * Получает список продуктов с возможностью фильтрации и пагинации.
   */
  async getAll(queryData = {} as TypeProductDataFilters): Promise<TypePaginationProducts> {
    console.log('ProductService.getAll: Запрос с параметрами:', queryData);
    const { data } = await axiosClassic<TypePaginationProducts>({
      url: `/${PRODUCTS}`, // Убедись, что PRODUCTS = 'games'
      method: 'GET',
      params: queryData,
    });
    console.log('ProductService.getAll: Получен ответ:', data);
    return data;
  },

  /**
   * Получает подсказки для поиска на основе введенного текста.
   */
  async getSearchSuggestions(searchTerm: string): Promise<ISearchSuggestion[]> {
    if (!searchTerm || !searchTerm.trim()) {
      return Promise.resolve([]); // Не делаем запрос, если строка пустая или только пробелы
    }
    console.log('ProductService.getSearchSuggestions: Запрос с searchTerm:', searchTerm);
    try {
      const { data } = await axiosClassic<ISearchSuggestion[]>({
        url: `/${PRODUCTS}/search-suggestions`, // Убедись, что PRODUCTS = 'games'
        method: 'GET',
        params: { searchTerm }, // Бэкенд ожидает searchTerm в query
      });
      console.log('ProductService.getSearchSuggestions: Получен ответ:', data);
      return data;
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      return []; // В случае ошибки возвращаем пустой массив, чтобы UI не ломался
    }
  },

  /**
   * Получает список похожих продуктов.
   */
  async getSimilar(id: string | number): Promise<IProduct[]> {
    const { data } = await axiosClassic<IProduct[]>({
      url: `/${PRODUCTS}/similar/${id}`, // Убедись, что PRODUCTS = 'games'
      method: 'GET',
    });
    return data;
  },

  /**
   * Получает продукт по его slug.
   * Бэкенд возвращает один объект, а не массив.
   */
  async getBySlug(slug: string): Promise<IProduct> {
    const { data } = await axiosClassic<IProduct>({
      url: `/${PRODUCTS}/by-slug/${slug}`, // Убедись, что PRODUCTS = 'games'
      method: 'GET',
    });
    return data;
  },

  /**
   * Получает список продуктов по slug категории.
   */
  async getByCategory(categorySlug: string): Promise<IProduct[]> { // categorySlug обычно строка
    const { data } = await axiosClassic<IProduct[]>({
      url: `/${PRODUCTS}/by-category/${categorySlug}`, // Убедись, что PRODUCTS = 'games'
      method: 'GET',
    });
    return data;
  },

  /**
   * Получает продукт по его ID.
   */
  async getById(id: string | number): Promise<IProduct> {
    const { data } = await instanse<IProduct>({
      url: `/${PRODUCTS}/${id}`, // Убедись, что PRODUCTS = 'games'
      method: 'GET',
    });
    return data;
  },

  /**
   * Запрашивает защищённый админ-эндпоинт и возвращает массив ключей игры.
   * Примечание: URL /admin/game-keys/${gameId} отличается от PRODUCTS.
   */
  async getGameKeys(gameId: number): Promise<{ key_id: number; is_used: boolean }[]> {
    console.log(`ProductService.getGameKeys: Запрос ключей для игры ID: ${gameId}`);
    const { data } = await instanse<{ key_id: number; is_used: boolean }[]>({
      url: `/admin/game-keys/${gameId}`, // Этот URL специфичен
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
   * Примечание: URL /admin/${PRODUCTS} отличается от PRODUCTS.
   */
  async create(data: TypeProductData): Promise<IProduct> {
    console.log('ProductService.create: Отправка данных:', data);
    const { data: created } = await instanse<IProduct>({
      url: `/admin/${PRODUCTS}`, // Убедись, что PRODUCTS = 'games'
      method: 'POST',
      data,
    });
    console.log('ProductService.create: Получен ответ:', created);
    return created;
  },

  /**
   * Обновляет существующий продукт (игру) через защищенный эндпоинт.
   * Примечание: URL /admin/${PRODUCTS}/${id} отличается от PRODUCTS.
   */
  async update(id: string | number, data: TypeProductData): Promise<IProduct> {
    console.log(`ProductService.update: Отправка данных для ID: ${id}:`, data);
    const { data: updated } = await instanse<IProduct>({
      url: `/admin/${PRODUCTS}/${id}`, // Убедись, что PRODUCTS = 'games'
      method: 'PATCH', // или PUT, в зависимости от твоего API
      data,
    });
    console.log(`ProductService.update: Получен ответ для ID: ${id}:`, updated);
    return updated;
  },

  /**
   * Удаляет продукт (игру) через защищенный эндпоинт.
   * Примечание: URL /admin/${PRODUCTS}/${id} отличается от PRODUCTS.
   */
  async delete(id: number): Promise<any> { // Тип 'any' тут не идеален, лучше конкретизировать, что возвращает API при удалении
    console.log(`ProductService.delete: Запрос на удаление ID: ${id}`);
    const { data } = await instanse({
      url: `/admin/${PRODUCTS}/${id}`, // Убедись, что PRODUCTS = 'games'
      method: 'DELETE',
    });
    console.log(`ProductService.delete: Ответ для ID: ${id}:`, data);
    return data;
  },
};