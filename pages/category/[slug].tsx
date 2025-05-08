// src/pages/category/[slug].tsx
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { CategoryService } from "@/src/assets/styles/services/category.service";
import { ProductService } from "@/src/assets/styles/services/product/product.service";
import Layout from "@/src/components/ui/layout/Layout";
import Meta from "@/src/components/ui/Meta";
import Catalog from "@/src/components/ui/catalog/Catalog";
import { ICategory } from "@/src/types/category.interface";
import { IProduct } from "@/src/types/product.interface";

interface Props {
  games: IProduct[];
  category: ICategory;
}

const CategoryPage: NextPage<Props> = ({ games, category }) => (
  <Meta title={category.category_name}>
    <Layout>
      {games.length > 0 ? (
        <Catalog games={games} title={category.category_name} />
      ) : (
        <div className="text-center py-10 text-lg text-gray-500">
          В этой категории пока нет игр.
        </div>
      )}
    </Layout>
  </Meta>
);

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: categories } = await CategoryService.getAll(); // AxiosResponse<ICategory[]>
  const paths = categories.map((cat: ICategory) => ({
    params: { slug: cat.slug },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;

  // получаем массив игр по категории (IProduct[])
  const gamesData: IProduct[] = await ProductService.getByCategory(slug);

  // получаем саму категорию (ICategory)
  const { data: category } = await CategoryService.getBySlug(slug);

  if (!category) {
    return { notFound: true };
  }

  const gamesWithCategory: IProduct[] = gamesData.map((game: IProduct) => ({
    ...game,
    game_categories:
      game.game_categories && game.game_categories.length > 0
        ? game.game_categories
        : [{ category_id: category.category_id, category }],
  }));

  return {
    props: {
      games: gamesWithCategory,
      category,
    },
    revalidate: 60,
  };
};

export default CategoryPage;
