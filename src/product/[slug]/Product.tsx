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
      .then(count => setAvailableKeys(count))
      .catch(err => {
        console.error('Не удалось загрузить количество ключей:', err);
        setAvailableKeys(0);
      });
  }, [game.game_id]);

  return (
    <>
      {/* Meta */}
      <Meta title={game.name} />

      {/* Название игры */}
      <Heading classname="mb-1">{game.name}</Heading>

      {/* Категории сразу под названием игры */}
      {game.game_categories && game.game_categories.length > 0 ? (
        <div className="text-sm text-black mb-2">
          <span className="font-semibold">Категории:&nbsp;</span>
          {game.game_categories.map(({ category }, idx) => (
            <span key={category.category_id}>
              <a href={`/category/${category.slug}`} className="text-aqua hover:text-red">
                {category.category_name}
              </a>
              {idx < game.game_categories.length - 1 && ', '}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-sm text-black mb-2">Без категории</div>
      )}

      {/* Количество отзывов */}
      <ProductReviewsCount product={game} />

      {/* Основная сетка */}
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