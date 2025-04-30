import { ICategory } from "@/src/types/category.interface";
import { IMenuItem } from "./menu.interface";

export const convertToMenuItems = (categories: ICategory[]): IMenuItem [] =>
    categories.map(category => ({
        label: category.category_name,
        href: `/category/${category.slug}`
    }))