import { ProductService } from "@/src/assets/styles/services/product/product.service";
import Home from "@/src/components/screeens/home/Home";
import { TypePaginationProducts, TypeProducts } from "@/src/types/product.interdace";
import { GetStaticProps, NextPage } from "next";

const HomePage: NextPage<TypePaginationProducts> = ({ games, length }) => {
    return <Home games = {games} length={length} />;
};

export const getStaticProps: GetStaticProps<TypePaginationProducts> = async () => {
      const  data  = await ProductService.getAll({
        page: 1,
        perPage: 4,
      });
      return {
        props: data 
      };
    }
  

export default HomePage;
