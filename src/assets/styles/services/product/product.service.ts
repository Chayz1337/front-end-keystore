// src/assets/styles/services/product/product.service.ts
import axios from 'axios';
import Cookies from 'js-cookie';

import { axiosClassic, instanse } from '../../api/api.interceptor';
import { IProduct, TypePaginationProducts } from '@/src/types/product.interface';
import { PRODUCTS, TypeProductDataFilters, TypeProductData } from './product.types';


export const ProductService = {
  async getAll(querryData = {} as TypeProductDataFilters) {
    const { data } = await axiosClassic<TypePaginationProducts>({
      url: PRODUCTS,
      method: 'GET',
      params: querryData
    });
    return data;
  },
  

  async getSimilar(Id: string | number) {
    return axiosClassic<IProduct[]>({
      url: `${PRODUCTS}/similar/${Id}`,
      method: 'GET',
    });
  },

  async getBySlug(slug: string) {
    const { data } = await axiosClassic<IProduct[]>({
      url: `${PRODUCTS}/by-slug/${slug}`,
      method: 'GET',
    });
    return data;
  },

  async getByCategory(categorySlug: string | number) {
    return axiosClassic<IProduct[]>({
      url: `${PRODUCTS}/by-category/${categorySlug}`,
      method: 'GET',
    });
  },

  async getById(id: string | number) {
    return instanse<IProduct[]>({
      url: `${PRODUCTS}/${id}`,
      method: 'GET',
    });
  },

  /** Запрашивает защищённый админ-эндпоинт и возвращает массив ключей */
  async getGameKeys(gameId: number): Promise<{ key_id: number; is_used: boolean }[]> {
    const res = await instanse<{ key_id: number; is_used: boolean }[]>({
      url: `admin/game-keys/${gameId}`,
      method: 'GET',
    });
    return res.data;
  },

  /** Подсчитывает число ключей с is_used = false */
  async getAvailableKeysCount(gameId: number): Promise<number> {
    const keys = await this.getGameKeys(gameId);
    return keys.filter(k => !k.is_used).length;
  },

  async create(data: { name: string, description: string, price: number, images: string[], categories: number[] }) {
    const response = await instanse<IProduct>({
      url: `admin/${PRODUCTS}`,
      method: 'POST',
      data: data
    });
    return response.data;
  },

  async update(id: string | number, data: TypeProductData) {
    return instanse<IProduct[]>({
      url: `${PRODUCTS}/${id}`,
      method: 'PUT',
      data
    });
  },

  async delete(id: number) {
    const response = await instanse({
      url: `admin/${PRODUCTS}/${id}`,
      method: 'DELETE',
    });
    return response.data;
  }
};
