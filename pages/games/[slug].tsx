// src/pages/games/[slug].tsx
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { ProductService } from '@/src/assets/styles/services/product/product.service';
import { IProduct } from '@/src/types/product.interface';
import Layout from '@/src/components/ui/layout/Layout';
import ProductInformation from '@/src/product/[slug]/product-information/ProductInformation';
import Product from '@/src/product/[slug]/Product';

interface Props {
  initialProduct: IProduct;
  similarProducts: IProduct[];
  slug: string;
}

const GamePage: NextPage<Props> = ({ initialProduct, similarProducts }) => {
  return (
    <Layout>
      {/* Здесь убираем информацию о наличии ключей */}
      <Product
        initialProduct={initialProduct}
        similarProducts={similarProducts}
        slug={initialProduct.slug}
      />
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { games } = await ProductService.getAll();
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

  // Получаем подробные данные товара (включая отзывы)
  try {
    const { data: details } = await ProductService.getById(product.game_id);
    if (details.length) {
      product = { ...product, ...details[0] };
    }
  } catch {
    console.warn('Не удалось получить полные данные');
  }

  // Получаем похожие продукты
  let similar: IProduct[] = [];
  try {
    const { data } = await ProductService.getSimilar(product.game_id);
    similar = data;
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
