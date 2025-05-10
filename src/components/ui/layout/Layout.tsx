'use client';

import { FC, PropsWithChildren } from "react";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
import { cn } from "@/src/utils/cn";
import { useIsAdminPanel } from "@/src/hooks/useIsAdminPanel";

const Layout: FC<PropsWithChildren<unknown>> = ({ children }) => {
    const { isAdminPanel } = useIsAdminPanel();
    const shouldShowSidebar = isAdminPanel;

    return (
        <div className="bg-bg-color min-h-screen flex flex-col">
            <Header />

            <div
                className={cn(
                    "flex-grow",
                    shouldShowSidebar ? "grid bg-secondary" : "block bg-secondary"
                )}
                style={shouldShowSidebar ? { gridTemplateColumns: '0.8fr 4fr' } : {}}
            >
                {shouldShowSidebar && <Sidebar />}

                <main
                    className={cn(
                        "p-6 md:p-12 pb-20 md:pb-52 bg-bg-color",
                        "min-h-[calc(100vh-64px)]", // ← тянет main вниз
                        {
                            "rounded-tl-lg": shouldShowSidebar,
                        }
                    )}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
