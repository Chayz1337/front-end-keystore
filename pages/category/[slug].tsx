import { CategoryService } from "@/src/assets/styles/services/category.service";
import { ProductService } from "@/src/assets/styles/services/product/product.service";
import Catalog from "@/src/components/ui/catalog/Catalog";
import Layout from "@/src/components/ui/layout/Layout";
import Meta from "@/src/components/ui/Meta";
import { ICategory } from "@/src/types/category.interface";
import { IProduct } from "@/src/types/product.interface";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";

const CategoryPage: NextPage<{
  games: IProduct[];
  category: ICategory;
}> = ({ games, category }) => {
  return (
    <Meta title={category.category_name}>
      <Layout>
        <Catalog 
          games={games || []} 
          title={category.category_name} 
        />
      </Layout>
    </Meta>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: categories } = await CategoryService.getAll();
  const paths = categories.map((category) => ({
    params: { slug: category.slug },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  // Получаем игры и категорию
  const { data: games } = await ProductService.getByCategory(slug);
  const { data: category } = await CategoryService.getBySlug(slug);

  if (!games || !category) {
    return { notFound: true };
  }
  console.log(games);
  // Добавляем категорию к играм, если её нет
  const gamesWithCategory = games.map(game => ({
    ...game,
    game_categories: game.game_categories || [{ category }],
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