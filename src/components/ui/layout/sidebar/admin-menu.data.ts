import { getAdminUrl } from "@/src/config/url.config";
import { IMenuItem } from "./menu.interface";

export const ADMIN_MENU: IMenuItem[] = [
    {
        label: 'Dashboard',
        href: getAdminUrl()
    },
    {
        label: 'Games',
        href: getAdminUrl('/games')
    },
    {
        label: 'Cetegories',
        href: getAdminUrl('/categories')
    },
    {
        label: 'Reviews',
        href: getAdminUrl('/reviews')
    },
    {
        label: 'Orders',
        href: getAdminUrl('/orders')
    }
]
