// src/pages/admin/products/Products.tsx
import AdminList from '@/src/components/ui/admin/admin-list/AdminList';
import Heading from '@/src/components/ui/button/Heading';
import Layout from '@/src/components/ui/layout/Layout'; // Импортируем Layout
import { FC } from 'react';
import { useAdminProducts } from './useAdminProducts';
import Meta from '@/src/components/ui/Meta';

const Products: FC = () => {
  const { data, isFetching, mutate } = useAdminProducts();

  return (
    <Layout>
      <Meta title = 'Админ панель - Игры' />
      <Heading classname="mb-7">Игры</Heading>
      <AdminList
        isLoading={isFetching} // Исправлено на правильный синтаксис
        listItems={data} // Передаем данные в компонент AdminList
        removeHandler={mutate} // Передаем функцию для удаления
      />
    </Layout>
  );
};

export default Products;
