// src/hooks/useIsAdminPanel.ts
import { usePathname } from "next/navigation";
import { ADMIN_PANEL_URL } from "../config/url.config"; // << ПРОВЕРЬТЕ ПУТЬ

export const useIsAdminPanel = () => {
    const pathname = usePathname();
    const isAdminPanel = pathname ? pathname.startsWith(ADMIN_PANEL_URL) : false; // Добавил проверку на pathname

    return {pathname, isAdminPanel};
};