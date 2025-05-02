// src/pages/admin/products/Products.tsx
import AdminList from '@/src/components/ui/admin/admin-list/AdminList';
import Heading from '@/src/components/ui/button/Heading';
import Layout from '@/src/components/ui/layout/Layout'; // Импортируем Layout
import { FC } from 'react';
import { useAdminOrders  } from './useAdminOrders';

const Orders: FC = () => {
  const { data, isFetching } = useAdminOrders();

  return (
    <Layout>
      <Heading classname="mb-7">Orders</Heading>
      <AdminList
        isLoading={isFetching} // Исправлено на правильный синтаксис
        listItems={data} // Передаем данные в компонент AdminList
      />
    </Layout>
  );
};

export default Orders;
