// src/pages/index.tsx
import { FC } from "react";
import Meta from "@/src/components/ui/Meta";
import Layout from "@/src/components/ui/layout/Layout";
// Удаляем импорты CatalogPagination и Button (если он больше не нужен здесь)
// import CatalogPagination from "@/src/components/ui/catalog/CatalogPagination";
// import Button from "@/src/components/ui/button/Button";
import ProductExplorer from "@/src/components/explorer/ProductExplorer"; // <-- Импортируем ProductExplorer
import { ProductService } from "@/src/assets/styles/services/product/product.service"; // <-- Импорт сервиса нужен для getStaticProps
import { TypePaginationProducts } from "@/src/types/product.interface";
import { GetStaticProps, NextPage } from "next";

// Теперь страница принимает initialProducts для ProductExplorer
const HomePage: NextPage<{ initialProducts: TypePaginationProducts }> = ({ initialProducts }) => {
  return (
    <Meta title="Главная">
      <Layout>
        {/* Убираем кнопку "Просмотреть игры" и контейнер для нее */}
        {/* 
        <div className="mt-3 mb-6 sm:mt-2 sm:mb-8"> 
          <Button
            as="a"
            href="/explorer"
            variant="orange"
          >
            Просмотреть игры
          </Button>
        </div> 
        */}

        {/* Вместо CatalogPagination используем ProductExplorer */}
        {/* Передаем ему начальные данные */}
        <ProductExplorer initialProducts={initialProducts} />
        {/* Заголовок "Игры" теперь будет внутри ProductExplorer */}

      </Layout>
    </Meta>
  );
};


// Изменяем getStaticProps, чтобы получить initialProducts
export const getStaticProps: GetStaticProps<{ initialProducts: TypePaginationProducts }> = async () => {
      // Загружаем больше продуктов для начального отображения, например, 8 (для 4 колонок) или 9 (для 3)
      const perPage = 8; // Пример для 4 колонок, 2 ряда. Можешь поменять на 9, если хочешь 3х3.
      const data = await ProductService.getAll({
        page: 1,
        perPage: perPage,
        // Можно добавить сортировку по умолчанию, например, по новизне

      });
      // getStaticProps теперь должен возвращать объект в формате { props: { initialProducts: ... } }
      return {
        props: { 
            initialProducts: data // Передаем весь объект с games и length/total
        },
        // Опционально: revalidate, чтобы страница периодически обновлялась в фоне
        // revalidate: 60 // например, раз в минуту
      };
    }


export default HomePage;