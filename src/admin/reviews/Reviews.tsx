import AdminList from '@/src/components/ui/admin/admin-list/AdminList';
import Heading from '@/src/components/ui/button/Heading';
import Layout from '@/src/components/ui/layout/Layout';
import { FC } from 'react';
import { useAdminReviews } from './useAdminReviews';

const Reviews: FC = () => {
  const { data, isFetching, mutate } = useAdminReviews(); 

  return (
    <Layout>
      <Heading classname="mb-7">Отзывы</Heading>
      <AdminList
        isLoading={isFetching}
        listItems={data}
        removeHandler={mutate}
      />
    </Layout>
  );
};

export default Reviews;
