// src/pages/index.tsx
import { FC } from "react";
import Meta from "@/src/components/ui/Meta";
import Layout from "@/src/components/ui/layout/Layout";
import ProductExplorer from "@/src/components/explorer/ProductExplorer"; // <-- Импортируем ProductExplorer
import { ProductService } from "@/src/assets/styles/services/product/product.service";
import { TypePaginationProducts } from "@/src/types/product.interface";
import { GetStaticProps, NextPage } from "next";

// 1. Тип NextPage теперь ожидает объект { initialProducts: TypePaginationProducts }
const HomePage: NextPage<{ initialProducts: TypePaginationProducts }> = ({ initialProducts }) => {
//                                                                     ^^^^^^^^^^^^^^^^^^^^^
  return (
    <Meta title="Главная">
      <Layout>
        {/* 2. Отображаем ProductExplorer и передаем ему initialProducts */}
        <ProductExplorer initialProducts={initialProducts} />
      </Layout>
    </Meta>
  );
};


// 3. getStaticProps возвращает данные внутри объекта props под ключом initialProducts
export const getStaticProps: GetStaticProps<{ initialProducts: TypePaginationProducts }> = async () => {
//                                                                     ^^^^^^^^^^^^^^^^^^^^^
      const perPage = 8; // Или 9, или другое число по твоему выбору
      const data = await ProductService.getAll({
        page: 1,
        perPage: perPage,
    
      });

      // Убедимся, что возвращаем правильную структуру { props: { initialProducts: ... } }
      return {
        props: {
            initialProducts: data // data это { games: [], length: number } или { games: [], total: number }
        },
        // revalidate: 60 // Опционально
      };
    }

export default HomePage;