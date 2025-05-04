import { getAdminUrl } from "@/src/config/url.config";
import { IMenuItem } from "./menu.interface";

export const ADMIN_MENU: IMenuItem[] = [
    {
        label: 'Статистика',
        href: getAdminUrl()
    },
    {
        label: 'Игры',
        href: getAdminUrl('/games')
    },
    {
        label: 'Категории',
        href: getAdminUrl('/categories')
    },
    {
        label: 'Отзывы',
        href: getAdminUrl('/reviews')
    },
    {
        label: 'Заказы',
        href: getAdminUrl('/orders')
    }
]
