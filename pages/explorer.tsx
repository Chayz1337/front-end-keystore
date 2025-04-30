// pages/explorer.tsx
import { GetServerSideProps, NextPage } from 'next';
import Layout from '@/src/components/ui/layout/Layout';
import ProductExplorer from '@/src/components/explorer/ProductExplorer';
import { ProductService } from '@/src/assets/styles/services/product/product.service';
import { CategoryService } from '@/src/assets/styles/services/category.service';
import { EnumProductSort, TypeProductDataFilters } from '@/src/assets/styles/services/product/product.types';
import { TypePaginationProducts } from '@/src/types/product.interface';

interface ExplorerPageProps {
  initialProducts: TypePaginationProducts;
}

const ExplorerPage: NextPage<ExplorerPageProps> = ({ initialProducts }) => (
  <Layout>
    <ProductExplorer initialProducts={initialProducts} />
  </Layout>
);

export const getServerSideProps: GetServerSideProps<ExplorerPageProps> = async ({ query }) => {
  // 1) Читаем slug из query (он у вас временно лежит в categoryId)
  const slug = query.categoryId as string | undefined;

  // 2) Если slug есть — маппим на числовой category_id
  let numericCategoryId: number | undefined;
  if (slug) {
    try {
      const { data: cat } = await CategoryService.getBySlug(slug);
      numericCategoryId = cat.category_id;
    } catch {
      return { notFound: true };
    }
  }

  // 3) Собираем общий объект фильтров как any
  const rawFilters: any = {
    sort: (query.sort as EnumProductSort) || undefined,
    searchTerm: (query.searchTerm as string) || undefined,
    page: (query.page as string) || undefined,
    perPage: (query.perPage as string) || undefined,
    ratings: (query.ratings as string) || undefined,
    minPrice: (query.minPrice as string) || undefined,
    maxPrice: (query.maxPrice as string) || undefined,
    // **ВАЖНО** — слать сюда ключ именно `category_id`, а не categoryId
    category_id: numericCategoryId,
  };

  // 4) Очищаем фильтры от пустых значений
  const cleanedFilters = Object.fromEntries(
    Object.entries(rawFilters).filter(([_, v]) => v != null && v !== '')
  );

  // 5) Запрашиваем продукты
  const initialProducts = await ProductService.getAll(cleanedFilters as TypeProductDataFilters);

  return { props: { initialProducts } };
};

export default ExplorerPage;
