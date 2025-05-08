// src/pages/games/[slug].tsx
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

const GamePage: NextPage<Props> = ({ initialProduct, similarProducts }) => {
  return (
    <Layout>
      <Product
        initialProduct={initialProduct}
        similarProducts={similarProducts}
        slug={initialProduct.slug}
      />
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { games } = await ProductService.getAll(); // допустим, этот метод возвращает { games: IProduct[] }
  const paths = games.map(game => ({
    params: { slug: game.slug },
  }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;

  // Получаем товар по slug
  const bySlug = await ProductService.getBySlug(slug);
  let product = Array.isArray(bySlug) ? bySlug[0] : bySlug;
  if (!product) return { notFound: true };

  // Получаем подробные данные по ID
  try {
    const details = await ProductService.getById(product.game_id); // теперь это IProduct или IProduct[]
    const detailed = Array.isArray(details) ? details[0] : details;
    if (detailed) {
      product = { ...product, ...detailed };
    }
  } catch {
    console.warn('Не удалось получить полные данные');
  }

  // Получаем похожие продукты
  let similar: IProduct[] = [];
  try {
    similar = await ProductService.getSimilar(product.game_id); // сразу массив
  } catch {
    console.error('Не удалось загрузить похожие продукты');
  }

  return {
    props: {
      initialProduct: product,
      similarProducts: similar,
      slug,
    },
    revalidate: 60,
  };
};

export default GamePage;
