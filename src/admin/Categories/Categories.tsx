// src/pages/admin/products/Products.tsx
import AdminList from '@/src/components/ui/admin/admin-list/AdminList';
import Heading from '@/src/components/ui/button/Heading';
import Layout from '@/src/components/ui/layout/Layout'; // Импортируем Layout
import { FC } from 'react';
import { useAdminCategories } from './useAdminCategories';

const Categories: FC = () => {
  const { data, isFetching, mutate } = useAdminCategories();

  return (
    <Layout>
      <Heading classname="mb-7">Categories</Heading>
      <AdminList
        isLoading={isFetching} // Исправлено на правильный синтаксис
        listItems={data} // Передаем данные в компонент AdminList
        removeHandler={mutate} // Передаем функцию для удаления
      />
    </Layout>
  );
};

export default Categories;
