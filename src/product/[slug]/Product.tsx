// src/product/[slug]/Product.tsx

import { FC, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IProduct } from '@/src/types/product.interface';
import { ProductService } from '@/src/assets/styles/services/product/product.service';
import Heading from '@/src/components/ui/button/Heading';
import { ProductGallery } from './ProductGallery';
import ProductReviewsCount from './ProductReviewsCount';
import ProductInformation from './product-information/ProductInformation';
import SimilarProducts from './SimilarProducts';
import ProductReviews from './product-reviews/ProductReviews';
import Meta from '@/src/components/ui/Meta';

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

  const [availableKeys, setAvailableKeys] = useState<number | null>(null);

  useEffect(() => {
    ProductService.getAvailableKeysCount(game.game_id)
      .then(count => {
        setAvailableKeys(count);
      })
      .catch(err => {
        console.error('Не удалось загрузить количество ключей:', err);
        setAvailableKeys(0);
      });
  }, [game.game_id]);

  return (
    <>
      {/* Вставляем Meta-компонент с мета-данными для страницы */}
      <Meta 
        title={game.name} 

      />
      
      <Heading classname="mb-1">{game.name}</Heading>
      <ProductReviewsCount product={game} />

      <div className="grid gap-12 mt-6" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <ProductGallery images={game.images} />
        <div className="opacity-80 font-light">
          <div className="font-semibold mb-1">Описание:</div>
          {game.description}
        </div>

        <ProductInformation product={game} availableKeys={availableKeys} />
      </div>

      <SimilarProducts similarProducts={similarProducts} />
      <ProductReviews reviews={game.reviews} productId={game.game_id} />
    </>
  );
};

export default Product;
