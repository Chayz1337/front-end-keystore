import { FC } from "react";
import Link from "next/link";
import Meta from "../../ui/Meta";
import Layout from "../../ui/layout/Layout";
import CatalogPagination from "../../ui/catalog/CatalogPagination";

import { useAuth } from "@/src/hooks/useAuth";
import { useActions } from "@/src/hooks/user.actions";
import { TypePaginationProducts } from "@/src/types/product.interface";

const Home: FC<TypePaginationProducts> = ({ games, length }) => {
  return (
    <Meta title="Home">
      <Layout>
        <Link href="/explorer" className="btn btn-white">
          Browse games
        </Link>
        <CatalogPagination title="Игры" data={{ games, length }} />
      </Layout>
    </Meta>
  );
};

export default Home;
