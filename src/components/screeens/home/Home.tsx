// src/pages/index.tsx
import { FC } from "react";
import Meta from "@/src/components/ui/Meta";
import Layout from "@/src/components/ui/layout/Layout";
import CatalogPagination from "@/src/components/ui/catalog/CatalogPagination";
import Button from "@/src/components/ui/button/Button";

import { TypePaginationProducts } from "@/src/types/product.interface";

const Home: FC<TypePaginationProducts> = ({ games, length }) => {
  return (
    <Meta title="Главная">
      <Layout>
        {/* Уменьшаем вертикальные отступы */}
        <div className="mt-3 mb-6 sm:mt-2 sm:mb-8"> 
          {/* 
            mt-3: margin-top: 0.75rem (12px) - маленький отступ сверху
            mb-6: margin-bottom: 1.5rem (24px) - отступ до каталога игр
            sm:mt-4: на sm экранах margin-top: 1rem (16px)
            sm:mb-8: на sm экранах margin-bottom: 2rem (32px) 
            Подбери значения, которые тебе нравятся.
          */}
          <Button
            as="a"
            href="/explorer"
            variant="orange"
          >
            Просмотреть игры
          </Button>
        </div>

        <CatalogPagination title="Игры" data={{ games, length }} />
      </Layout>
    </Meta>
  );
};

export default Home;