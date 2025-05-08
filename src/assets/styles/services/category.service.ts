import axios from 'axios';
import Cookies from 'js-cookie';

import { ICategory } from '@/src/types/category.interface';
import { axiosClassic, instanse } from '../api/api.interceptor';


const CATEGORY = 'categories'

export const CategoryService = {
    async getAll() {
        return axiosClassic <ICategory[]>({
            url: CATEGORY,
            method: 'GET'
        })
    },
    async getById(category_id: string | number) {
        return instanse <ICategory[]>({
            url: `/admin/${CATEGORY}/${category_id}`,
            method: 'GET'
        })
    },
    async getBySlug(slug: string) {
        return axiosClassic <ICategory>({
            url: `${CATEGORY}/by-slug/${slug}`,
            method: 'GET'
        })
    },
    async create(name: string) {
        return instanse<ICategory>({
          url: `/admin/${CATEGORY}`,
          method: 'POST',
          data: { category_name: name },
        });
      },
    async update(categoryId: number, name: string) {
        // отправляем именно category_name
        return instanse<ICategory>({
          url: `/admin/${CATEGORY}/${categoryId}`,
          method: 'PUT',
          data: { category_name: name },
        });
      },
    async delete(category_id: string | number) {
        return instanse <ICategory[]>({
            url: `/admin/${CATEGORY}/${category_id}`,
            method: 'DELETE'
        })
    },
}


