// pages/explorer.tsx
import { GetServerSideProps, NextPage } from 'next';
import Layout from '@/src/components/ui/layout/Layout';
import ProductExplorer from '@/src/components/explorer/ProductExplorer';
import { ProductService } from '@/src/assets/styles/services/product/product.service';
import { CategoryService } from '@/src/assets/styles/services/category.service';
import { EnumProductSort, TypeProductDataFilters } from '@/src/assets/styles/services/product/product.types';
import { TypePaginationProducts } from '@/src/types/product.interface';
import Meta from '@/src/components/ui/Meta';


interface ExplorerPageProps {
  initialProducts: TypePaginationProducts;
}

const ExplorerPage: NextPage<ExplorerPageProps> = ({ initialProducts }) => (
  <Layout>
    <Meta 
      title="Игры по параметрам" 
    />
    <ProductExplorer initialProducts={initialProducts} />
  </Layout>
);

export const getServerSideProps: GetServerSideProps<ExplorerPageProps> = async ({ query }) => {
  const slug = query.categoryId as string | undefined;

  let numericCategoryId: number | undefined;
  if (slug) {
    try {
      const { data: cat } = await CategoryService.getBySlug(slug);
      numericCategoryId = cat.category_id;
    } catch {
      return { notFound: true };
    }
  }

  const rawFilters: any = {
    sort: (query.sort as EnumProductSort) || undefined,
    searchTerm: (query.searchTerm as string) || undefined,
    page: (query.page as string) || undefined,
    perPage: (query.perPage as string) || undefined,
    ratings: (query.ratings as string) || undefined,
    minPrice: (query.minPrice as string) || undefined,
    maxPrice: (query.maxPrice as string) || undefined,
    category_id: numericCategoryId,
  };

  const cleanedFilters = Object.fromEntries(
    Object.entries(rawFilters).filter(([_, v]) => v != null && v !== '')
  );

  const initialProducts = await ProductService.getAll(cleanedFilters as TypeProductDataFilters);

  return { props: { initialProducts } };
};

export default ExplorerPage;
