import { useState } from 'react';

import AdminList from '@/src/components/ui/admin/admin-list/AdminList';
import Heading from '@/src/components/ui/button/Heading';
import Layout from '@/src/components/ui/layout/Layout';
import { FC } from 'react';
import { useAdminProducts } from './useAdminProducts';
import Meta from '@/src/components/ui/Meta';
import AddGameModal from '@/src/components/ui/modal/AddGameModal';
import Button from '@/src/components/ui/button/Button';

const Products: FC = () => {
  const { data, isFetching, mutate } = useAdminProducts();
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddGame = () => {
    setModalOpen(true);
  };

  const handleRemoveGame = (gameId: number) => {
    mutate(gameId);  // Передаем gameId для удаления игры
  };

  return (
    <Layout>
      <Meta title="Админ панель - Игры" />
      <Heading classname="mb-7">Игры</Heading>
      {/* Контейнер с Flexbox для выравнивания кнопки */}
      <div className="flex justify-start mb-4">
        <Button onClick={handleAddGame} variant='orange'>
          Добавить игру
        </Button>
      </div>
      <AdminList
        isLoading={isFetching}
        listItems={data}
        removeHandler={handleRemoveGame} // Передаем функцию для удаления
      />
      <AddGameModal isOpen={modalOpen} closeModal={() => setModalOpen(false)} />
    </Layout>
  );
};

export default Products;
