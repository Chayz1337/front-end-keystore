// src/components/ui/catalog/product-item/ProductItemSkeleton.tsx
import React from 'react';

const ProductItemSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse"> {/* Анимация пульсации */}
      {/* Placeholder для изображения */}
      <div className="bg-gray-300 dark:bg-gray-700 rounded-xl h-52 sm:h-64 w-full mb-2"></div>
      {/* Placeholder для названия */}
      <div className="bg-gray-300 dark:bg-gray-700 rounded h-5 w-3/4 mb-2"></div>
      {/* Placeholder для рейтинга */}
      <div className="bg-gray-300 dark:bg-gray-700 rounded h-4 w-1/2 mb-2"></div>
      {/* Placeholder для категорий */}
      <div className="bg-gray-300 dark:bg-gray-700 rounded h-4 w-full mb-3"></div>
      {/* Placeholder для цены */}
      <div className="bg-gray-300 dark:bg-gray-700 rounded h-6 w-1/3 mt-auto pt-1"></div>
    </div>
  );
};

export default ProductItemSkeleton;