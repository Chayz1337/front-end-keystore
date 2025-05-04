// src/pages/admin/products/Products.tsx
import AdminList from '@/src/components/ui/admin/admin-list/AdminList';
import Heading from '@/src/components/ui/button/Heading';
import Layout from '@/src/components/ui/layout/Layout'; // Импортируем Layout
import { FC } from 'react';
import { useAdminCategories } from './useAdminCategories';
import Meta from '@/src/components/ui/Meta';

const Categories: FC = () => {
  const { data, isFetching, mutate } = useAdminCategories();

  return (
    <Layout>
      <Meta title = 'Админ панель - Категории' />
      <Heading classname="mb-7">Категории</Heading>
      <AdminList
        isLoading={isFetching} // Исправлено на правильный синтаксис
        listItems={data} // Передаем данные в компонент AdminList
        removeHandler={mutate} // Передаем функцию для удаления
      />
    </Layout>
  );
};

export default Categories;
