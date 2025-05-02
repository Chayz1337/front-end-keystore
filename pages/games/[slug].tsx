import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ProductService } from '@/src/assets/styles/services/product/product.service';
import { IProduct } from '@/src/types/product.interface';
import Layout from '@/src/components/ui/layout/Layout';
import Product from '@/src/product/[slug]/Product';

interface Props {
  initialProduct: IProduct;
  similarProducts: IProduct[];
  slug: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { games } = await ProductService.getAll();
  const paths = games.map((game) => ({
    params: { slug: game.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;

  // 1) Получаем по слагу
  const bySlug = await ProductService.getBySlug(slug);
  let initialProduct: IProduct | undefined = Array.isArray(bySlug) ? bySlug[0] : bySlug;
  if (!initialProduct) {
    return { notFound: true };
  }

  // 2) Подхватываем полные данные (включая отзывы) по ID
  try {
    const { data: detailed } = await ProductService.getById(initialProduct.game_id);
    initialProduct = detailed[0] ?? initialProduct;
  } catch (err) {
    console.warn('Не удалось получить полные данные:', err);
  }

  // 3) Получаем похожие игры
  let similarProducts: IProduct[] = [];
  try {
    const { data } = await ProductService.getSimilar(initialProduct.game_id);
    similarProducts = data;
  } catch (err) {
    console.error('Не удалось загрузить похожие продукты:', err);
    similarProducts = [];
  }

  return {
    props: {
      initialProduct,
      similarProducts,
      slug,
    },
    revalidate: 60,
  };
};

const GamePage: NextPage<Props> = ({ initialProduct, similarProducts, slug }) => {
  return (
    <Layout>
      <Product
        initialProduct={initialProduct}
        similarProducts={similarProducts}
        slug={slug}
      />
    </Layout>
  );
};

export default GamePage;
