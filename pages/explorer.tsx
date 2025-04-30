
// explorer.tsx
'use client' // Убедитесь, что эта директива нужна, если ProductExplorer использует клиентские хуки

import { GetServerSideProps, NextPage } from "next";
// useRouter и query убраны из импортов, так как они не используются в самом компоненте ExplorerPage
import { EnumProductSort, TypeProductDataFilters } from "@/src/assets/styles/services/product/product.types";
import ProductExplorer from "@/src/components/explorer/ProductExplorer";
import { ProductService } from "@/src/assets/styles/services/product/product.service";
import { TypePaginationProducts } from "@/src/types/product.interdace";
import Layout from "@/src/components/ui/layout/Layout";

interface ExplorerPageProps {
  initialProducts: TypePaginationProducts;
}

const ExplorerPage: NextPage<ExplorerPageProps> = ({ initialProducts }) => {
  // const router = useRouter(); // <-- Удалено, не используется в компоненте
  // const { query } = router; // <-- Удалено, не используется в компоненте

  return (
    // Контент страницы обернут в Layout
    <Layout>
      <ProductExplorer initialProducts={initialProducts} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context; // query используется здесь, в серверной части

  const filters: TypeProductDataFilters = {
    sort: (query.sort as EnumProductSort) || null,
    searchTerm: (query.searchTerm as string) || undefined,
    page: (query.page as string) || undefined,
    perPage: (query.perPage as string) || undefined,
    ratings: (query.ratings as string) || undefined,
    minPrice: (query.minPrice as string) || undefined,
    maxPrice: (query.maxPrice as string) || undefined,
    categoryId: (query.categoryId as string) || undefined,
  };

  // Удаляем все поля, где значение null или undefined
  const cleanedFilters = cleanObject(filters);

  const initialProducts = await ProductService.getAll(cleanedFilters);

  return {
    props: {
      initialProducts,
    },
  };
};

// Утилита для очистки объекта от null и undefined
function cleanObject<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined)
  ) as Partial<T>;
}

export default ExplorerPage;

