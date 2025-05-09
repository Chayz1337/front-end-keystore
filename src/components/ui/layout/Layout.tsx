// src/components/ui/layout/Layout.tsx
'use client'; // Если используешь App Router и хуки Next.js на клиенте

import { FC, PropsWithChildren } from "react";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
// useRouter или usePathname больше не нужны здесь для определения показа Sidebar,
// если useIsAdminPanel уже использует их внутри себя.
// import { useRouter } from "next/router"; // Или 'next/navigation' для App Router
import { cn } from "@/src/utils/cn";
import { useIsAdminPanel } from "@/src/hooks/useIsAdminPanel"; // <<<=== ИМПОРТИРУЕМ ХУК

const Layout: FC<PropsWithChildren<unknown>> = ({ children }) => {
    const { isAdminPanel } = useIsAdminPanel(); // <<<=== ИСПОЛЬЗУЕМ ХУК

    // Теперь shouldShowSidebar определяется только тем, является ли страница админской
    const shouldShowSidebar = isAdminPanel;

    return (
        <div className="bg-bg-color min-h-screen flex flex-col"> {/* Добавил min-h-screen и flex-col для общего layout */}
            <Header />
            <div
                className={cn(
                    "flex-grow", // Чтобы этот div занимал оставшееся пространство
                    shouldShowSidebar ? "grid bg-secondary" : "block bg-secondary" // grid и фон только если есть сайдбар
                                                                                    // или просто block, если фон secondary общий
                )}
                style={shouldShowSidebar ? { gridTemplateColumns: '0.8fr 4fr' } : {}}
            >
                {shouldShowSidebar && <Sidebar />}
                <main
                    className={cn(
                        "p-6 md:p-12 pb-20 md:pb-52 bg-bg-color", // Адаптивные паддинги
                        {
                            "rounded-tl-lg": shouldShowSidebar, // Скругление только если есть сайдбар
                        }
                        // Если !shouldShowSidebar, main занимает всю ширину контейнера .block
                    )}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;