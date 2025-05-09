import Link from "next/link";
import { FC } from "react";
import Image from "next/image";
import { AiOutlineHeart } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { BiLogIn } from "react-icons/bi"; // Иконка входа

import HeaderProfile from "./HeaderProfile";
import Search from "./Search";
import HeaderCart from "./cart/HeaderCart";
import { useIsAdminPanel } from "@/src/hooks/useIsAdminPanel";
import { useAuth } from "@/src/hooks/useAuth";

const Header: FC = () => {
  const { isAdminPanel } = useIsAdminPanel();
  const { user } = useAuth();

  return (
    <header
      className="bg-secondary w-full py-6 px-6 grid"
      style={{ gridTemplateColumns: "1fr 3fr 1.2fr" }}
    >
        <Link href="/">
          {isAdminPanel ? (
            <div className="flex items-center h-full w-full">
              <h2 className="text-3xl text-while font-semibold pl-10">Admin Panel</h2>
            </div>
          ) : (
            <Image
              priority
              width={300}
              height={110}
              src="/images/logo.png"
              alt="GameShop"
            />
          )}
        </Link>

      <Search />

      <div className="flex items-center justify-end gap-10">
        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className="hover:text-primary transition-colors duration-200 text-while inline-block text-lg"
            title="Панель администратора"
          >
            <MdOutlineAdminPanelSettings size={37} />
          </Link>
        )}

        {user ? (
          <>
            <Link href="/favorites" className="text-while hover:text-primary" title="Избранное" >
              <AiOutlineHeart size={37} />
            </Link>
            <HeaderCart />
            <HeaderProfile />
          </>
        ) : (
          <Link
            href="/auth"
            className="text-while hover:text-primary transition-colors duration-200"
            title="Войти"
          >
            <BiLogIn size={35} />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
