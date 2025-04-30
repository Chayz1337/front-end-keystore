import { useProfile } from "@/src/hooks/useProfile";
import { FC } from "react";
import { FaUserAlt } from "react-icons/fa"; // Иконка пользователя
import Image from "next/image";
import { useOutside } from "@/src/hooks/useOutside";
import { useAuth } from "@/src/hooks/useAuth"; // Хук для получения данных о пользователе
import Link from "next/link";

const HeaderProfile: FC = () => {
  const { profile } = useProfile();
  const { isShow, ref, setIsShow } = useOutside(false);
  const { user } = useAuth(); // Получаем данные о пользователе

  // Если пользователя нет в системе, не показываем аватарку
  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setIsShow(!isShow)}>
        {/* Если у пользователя есть аватарка, показываем её, иначе показываем иконку */}
        {profile?.avatarPath ? (
          <Image
            width={43}
            height={43}
            src={profile.avatarPath}
            alt="profile"
            className="rounded-full border-primary border border-solid animate-soft-ping"
          />
        ) : (
          <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-300 text-while">
            <FaUserAlt size={34} />
          </div>
        )}
      </button>

      {/* Если меню показано, показываем выпадающий список */}
      {isShow && (
        <div
          className="absolute w-40 right-2 z-20"
          style={{
            top: "calc(100% + 1rem)",
          }}
        >
          <Link
            href="/my-orders"
            className="bg-while shadow py-2 px-4 block w-full rounded-md hover:text-primary duration-300 transition-colors"
          >
            My orders
          </Link>
        </div>
      )}
    </div>
  );
};

export default HeaderProfile;
