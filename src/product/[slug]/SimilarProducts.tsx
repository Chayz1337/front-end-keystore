import { FC } from "react";
import Heading from "@/src/components/ui/button/Heading";
import ProductItem from "@/src/components/ui/catalog/product-item/ProductItem";
import { IProduct } from "@/src/types/product.interface";

interface ISimilarProducts {
  similarProducts: IProduct[];
}

const SimilarProducts: FC<ISimilarProducts> = ({ similarProducts }) => {
  return (
    <div className="mt-20">
      <Heading classname="mb-7">Похожие игры:</Heading>
      {similarProducts.length ? (
        <div className="grid grid-cols-4 gap-10">
          {similarProducts.map((product) => (
            <ProductItem key={product.game_id} games={product} />
          ))}
        </div>
      ) : (
        <div>There are no products</div>
      )}
    </div>
  );
};

export default SimilarProducts;
