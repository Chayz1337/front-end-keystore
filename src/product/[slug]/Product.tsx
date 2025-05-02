'use client';

import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IProduct } from '@/src/types/product.interface';
import { ProductService } from '@/src/assets/styles/services/product/product.service';
import Heading from '@/src/components/ui/button/Heading';
import { ProductGallery } from './ProductGallery';
import ProductReviewsCount from './ProductReviewsCount';
import ProductInformation from './product-information/ProductInformation';
import SimilarProducts from './SimilarProducts';

interface IProductPage {
  initialProduct: IProduct;
  similarProducts: IProduct[];
  slug?: string;
}

const Product: FC<IProductPage> = ({ initialProduct, similarProducts, slug = '' }) => {
  const { data: game } = useQuery<IProduct>({
    queryKey: ['get product', initialProduct.game_id],
    queryFn: async () => {
      const arr = await ProductService.getBySlug(slug);
      return Array.isArray(arr) ? arr[0] : arr;
    },
    initialData: initialProduct,
    enabled: !!slug,
  });

  return (
    <>
      <Heading classname="mb-1">{game.name}</Heading>
      <ProductReviewsCount product={game} />

      <div className="grid gap-12 mt-6" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <ProductGallery images={game.images} />
        <div className="opacity-80 font-light">
          <div className="font-semibold mb-1">Description:</div>
          {game.description}
        </div>
        <ProductInformation product={game} />
      </div>

      <SimilarProducts similarProducts={similarProducts} />
    </>
  );
};

export default Product;
