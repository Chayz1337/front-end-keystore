import Catalog from "@/src/components/ui/catalog/Catalog";
import Layout from "@/src/components/ui/layout/Layout";
import Meta from "@/src/components/ui/Meta";
import { useProfile } from "@/src/hooks/useProfile";
import { NextPageAuth } from "@/src/providers/auth-provider/auth-page.types";

const FavoritesPage: NextPageAuth = () => {
    const {profile} = useProfile();
    console.log(profile?.favorites);  // Для отладки: проверяем, какие данные получаем

    return (
        <Meta title='Избранное'>
            <Layout>
                <Catalog games={profile?.favorites || []} title='Список избранного' />
            </Layout>
        </Meta>
    );
};

/*FavoritesPage.isOnlyUser = true*/

export default FavoritesPage;
