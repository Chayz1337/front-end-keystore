import Link from "next/link";
import { FC } from "react";
import Image from "next/image"; 
import { AiOutlineHeart } from "react-icons/ai";
import HeaderProfile from "./HeaderProfile";
import Search from "./Search";
import HeaderCart from "./cart/HeaderCart";
import { useIsAdminPanel } from "@/src/hooks/useIsAdminPanel";
import { useAuth } from "@/src/hooks/useAuth";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

const Header: FC = () => {
    const {isAdminPanel} = useIsAdminPanel()
    const {user} = useAuth()
    return (
        <header className="bg-secondary w-full py-6 px-6 grid" style={{ gridTemplateColumns: '1fr 3fr 1.2fr' }}>
            <Link href="/">
            {isAdminPanel ? (
                <h2 className='text-3xl text-while font-semibold'>Admin Panel</h2> ) : (
                <Image priority width={300} height={110} src="/images/logo.png" alt="GameShop" /> )}
            </Link>
            <Search /> 
            <div className="flex items-center justify-end gap-10">
            {user?.role === 'ADMIN' && (
                <Link href="/admin"
                className="hover:text-primary transition-colors duration-200 text-while inline-block text-lg">
                    <MdOutlineAdminPanelSettings size={37} />
  </Link>
)}

                <Link href='/favorites' className="text-while">
                    <AiOutlineHeart size={37} />
                </Link>
                <HeaderCart />
                <HeaderProfile />
            </div>
        </header>
    );
};

export default Header;
