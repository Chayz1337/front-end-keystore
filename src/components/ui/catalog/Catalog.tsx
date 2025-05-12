// src/components/ui/catalog/Catalog.tsx
import { FC } from "react";
import ProductItem from "./product-item/ProductItem";
import Heading from "../button/Heading";
import { IProduct } from "@/src/types/product.interface";
import { cn } from "@/src/utils/cn";

// 1. Обновляем интерфейс ICatalog
 interface ICatalog {
    games: IProduct[];
    title?: string;
    isFilterOpen?: boolean; // <-- ДОБАВЛЕНО: Опциональный проп для состояния фильтра
 }

// 2. Компонент принимает isFilterOpen в пропсах
const Catalog: FC<ICatalog> = ({ games, title, isFilterOpen }) => {

    return (
      <section>
        {title && <Heading classname="mb-5">{title}</Heading>}
        {games.length ? (
          // 3. Используем isFilterOpen для установки классов сетки
          <div className={cn("grid gap-10", {
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': isFilterOpen, // 3 колонки, если фильтры открыты
              'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4': !isFilterOpen // 4 колонки, если закрыты
          })}>
            {games.map((game) => (
              <ProductItem key={game.game_id} games={game} />
            ))}
          </div>
        ) : (
          // Сообщение, если игр нет
          <div className="text-center text-gray-500 mt-10">Игр по вашим критериям не найдено.</div>
        )}
      </section>
    );
  };

export default Catalog;