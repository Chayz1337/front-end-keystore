import axios from 'axios';
import Cookies from 'js-cookie';

import { axiosClassic, instanse } from '../../api/api.interceptor';
import { IProduct, TypePaginationProducts } from '@/src/types/product.interdace';
import { PRODUCTS, TypeProductDataFilters, TypeProductData } from './product.types';


export const ProductService = {
    async getAll(querryData = {} as TypeProductDataFilters) {
        const { data } = await axiosClassic <TypePaginationProducts>({
            url: PRODUCTS,
            method: 'GET',
            params: querryData
        })
        return data
    },
    async getSimilar(Id: string | number) {
        return axiosClassic <IProduct[]>({
            url: `${PRODUCTS}/similar/${Id}`,
            method: 'GET',
        })
    },
    async getBySlug(slug: string) {
        const {data} = await axiosClassic <IProduct[]>({
            url: `${PRODUCTS}/by-slug/${slug}`,
            method: 'GET',
        })
        return data
    },
    
    async getByCategory(categorySlug: string | number) {
        return axiosClassic <IProduct[]>({
            url: `${PRODUCTS}/by-category/${categorySlug}`,
            method: 'GET',
        })
    },
    async getById(id: string | number) {
        return instanse <IProduct[]>({
            url: `${PRODUCTS}/${id}`,
            method: 'GET',
        })
    },
    
    async create() {
        return instanse <IProduct[]>({
            url: PRODUCTS,
            method: 'POST'
        })
    },
    async update(id: string | number,  data:TypeProductData) {
        return instanse <IProduct[]>({
            url: `${PRODUCTS}/${id}`,
            method: 'PUT',
            data
    })
},
    async delete(id: string | number) {
        return instanse <IProduct[]>({
            url: `${PRODUCTS}/${id}`,
            method: 'DELETE'
        })
    },
}


