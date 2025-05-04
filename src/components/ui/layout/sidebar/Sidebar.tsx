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
    const { isAdminPanel, pathname } = useIsAdminPanel()

    return (
        <aside
            className="bg-secondary flex flex-col justify-between"
            style={{ height: 'calc(100vh - 91px)' }}
        >
            <div>
                {isLoading ? (
                    <div className="text-white ml-6 mt-4">Loading...</div>
                ) : data ? (
                    <>
                        <div className="text-3xl text-white mt-4 mb-6 ml-6 text-primary font-semibold"> {isAdminPanel ? 'Меню' : 'Категории '}👇
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
                    <div className="text-white ml-6 mt-4">Categories not found!</div>
                )}
            </div>

            {!!user && (
                <button
                    className="flex items-center ml-10 mb-10 hover:text-primary transition-colors duration-20  text-while"
                    onClick={() => logout()}
                >
                    <FiLogOut />
                    <span className="ml-2 ">Logout</span>
                </button>
            )}
        </aside>
    );
};

export default Sidebar;
