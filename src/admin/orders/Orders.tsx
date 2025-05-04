// src/pages/admin/products/Products.tsx
import AdminList from '@/src/components/ui/admin/admin-list/AdminList';
import Heading from '@/src/components/ui/button/Heading';
import Layout from '@/src/components/ui/layout/Layout';
import { FC } from 'react';
import { useAdminOrders } from './useAdminOrders';

const Orders: FC = () => {
  const { data, isFetching } = useAdminOrders();

  return (
    <Layout>
      <Heading classname="mb-7">Все заказы</Heading>
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        <AdminList
          isLoading={isFetching}
          listItems={data}
        />
      </div>
    </Layout>
  );
};

export default Orders;
