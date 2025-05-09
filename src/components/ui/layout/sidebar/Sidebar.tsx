import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "@/src/hooks/useAuth";
import { useActions } from "@/src/hooks/user.actions";
import { CategoryService } from "@/src/assets/styles/services/category.service";
import { cn } from "@/src/utils/cn";
import { useIsAdminPanel } from "@/src/hooks/useIsAdminPanel";
import { ADMIN_MENU } from "./admin-menu.data";
import { convertToMenuItems } from "./convert-to-menu-items";

const Sidebar: FC = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['get categories'],
        queryFn: () => CategoryService.getAll(),
        select: (response) => response.data,
    });

    const { asPath } = useRouter();
    const { user } = useAuth();
    const { logout } = useActions();
    const { isAdminPanel, pathname } = useIsAdminPanel();

    return (
        <div className="bg-secondary flex flex-col" style={{ minHeight: '100vh' }}>
            <div className="flex-grow">
                {isLoading ? (
                    <div className="text-while ml-6 mt-4">Loading...</div>
                ) : data ? (
                    <>
                        <div className="text-3xl mt-4 mb-6 ml-6 text-primary font-semibold">
                            {isAdminPanel ? 'Меню' : 'Категории '}👇
                        </div>
                        <ul>
                            {(isAdminPanel ? ADMIN_MENU : convertToMenuItems(data)).map(item => (
                                <li key={item.href}>
                                    <Link
                                        className={cn(
                                            'block text-2xl my-3 px-10 hover:text-primary transition-colors duration-200 ',
                                            pathname === item.href
                                                ? 'text-primary'
                                                : 'text-while'
                                        )}
                                        href={item.href}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <div className="text-while ml-6 mt-4">Categories not found!</div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
