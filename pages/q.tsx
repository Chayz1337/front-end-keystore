import { ProductService } from "@/src/assets/styles/services/product/product.service";
import Catalog from "@/src/components/ui/catalog/Catalog";
import Layout from "@/src/components/ui/layout/Layout";
import Meta from "@/src/components/ui/Meta";
import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { useRouter } from "next/router";

const SearchPage: NextPage = () => {
    const { query } = useRouter();


    const { data } = useQuery(
        {
            queryKey: ['Поиск игр', query.term], 
            queryFn: () => ProductService.getAll({
                searchTerm: query.term as string
            }),
        }
    );

    return (
        <Meta title="Поиск">
            <Layout>
                <Catalog 
                    games={data?.games || []} 
                    title={`Поиск по запросу "${query.term || ''}"`} 
                />
            </Layout>
        </Meta>
    );
}

export default SearchPage;

