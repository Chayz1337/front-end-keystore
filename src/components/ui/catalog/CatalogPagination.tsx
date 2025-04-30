import { FC, useState } from "react";
import ProductItem from "./product-item/ProductItem";
import Spinner from "../input/Spinner";
import Heading from "../button/Heading";
import SortDropdown from "./SortDropdown";
import Button from "../button/Button";
import { EnumProductSort } from "@/src/assets/styles/services/product/product.types";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/src/assets/styles/services/product/product.service";
import { TypePaginationProducts } from "@/src/types/product.interface";

// Тип данных ответа, который содержит информацию о пагинации
interface ICatalogPagination {
  data: TypePaginationProducts;
  title?: string;
}

const CatalogPagination: FC<ICatalogPagination> = ({ data, title }) => {
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState<EnumProductSort>(EnumProductSort.NEWEST);
  const [isSorting, setIsSorting] = useState(false);

  // Запрос данных с использованием react-query
  const { data: response, isLoading } = useQuery({
    queryKey: ["games", sortType, page], // Добавляем page в ключ
    queryFn: async () => {
      setIsSorting(true);
      const result = await ProductService.getAll({
        page,
        perPage: 4,
        sort: sortType,
      });
      setTimeout(() => setIsSorting(false), 500);
      return result;
    },
    initialData: data,
  });

  if (isLoading) return <Spinner />;

  return (
    <section>
      {title && <Heading classname="mb-5">{title}</Heading>}

      <div className="flex items-center justify-between mb-5">
        <div></div> {/* Пустой div для выравнивания */}
        <SortDropdown sortType={sortType} setSortType={setSortType} />
      </div>

      {/* Отображение продуктов */}
      {response?.games.length ? (
        <>
          <div className="grid grid-cols-4 gap-10">
            {response.games.map((game) => (
              <ProductItem key={game.game_id} games={game} isSorting={isSorting} />
            ))}
          </div>

          {/* Пагинация */}
          <div className="text-center mt-10 ">
            <div className="inline-flex items-center gap-1">
              {/* Генерация кнопок пагинации */}
              {Array.from({ length: Math.ceil(response.length / 4) }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={page === pageNumber ? "orange" : "white"}
                    onClick={() => setPage(pageNumber)}
                    className="p-2 w-10 h-8 flex items-center justify-center text-sm"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div>Тут нет продуктов</div>
      )}
    </section>
  );
};

export default CatalogPagination;
