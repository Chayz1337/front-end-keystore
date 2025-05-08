// src/pages/admin/products/Products.tsx
import { useState } from 'react';
import AdminList from '@/src/components/ui/admin/admin-list/AdminList';
import Heading from '@/src/components/ui/button/Heading';
import Layout from '@/src/components/ui/layout/Layout';
import { FC } from 'react';
import { useAdminProducts } from './useAdminProducts';
import Meta from '@/src/components/ui/Meta';
import AddGameModal from '@/src/components/ui/modal/AddGameModal';
import Button from '@/src/components/ui/button/Button';
import { gameKeyService } from '@/src/assets/styles/services/product/game-key.service';
import AddKeysModal from '@/src/components/ui/modal/AddKeysModal';
import { IProduct } from '@/src/types/product.interface';
import { ProductService } from '@/src/assets/styles/services/product/product.service';

const Products: FC = () => {
  const {
    data,
    isFetching,
    mutate: deleteGameMutate,
    refetch: refetchAdminProducts,
  } = useAdminProducts();

  const [editGameData, setEditGameData] = useState<IProduct | null>(null);
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [keysModalOpen, setKeysModalOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

  const handleAddGame = () => {
    setEditGameData(null);
    setGameModalOpen(true);
  };

  const handleEditGameClicked = (gameId: number) => {
    const loadAndEdit = async () => {
      try {
        // Получаем либо IProduct, либо IProduct[]
        const response = await ProductService.getById(gameId);
        // Поскольку getById теперь отдаёт сразу данные:
        const fullGameData: IProduct | undefined = Array.isArray(response)
          ? response[0]
          : response;

        if (!fullGameData) {
          alert(`Не удалось загрузить данные игры (ID: ${gameId})`);
          console.warn(`Пустой результат getById(${gameId})`);
          return;
        }

        setEditGameData(fullGameData);
        setGameModalOpen(true);
      } catch (error) {
        console.error(`Ошибка при загрузке данных игры ${gameId}:`, error);
        alert('Не удалось загрузить данные игры. Смотри консоль.');
      }
    };

    loadAndEdit();
  };

  const handleRemoveGame = (gameId: number) => {
    if (window.confirm(`Удалить игру ID ${gameId}?`)) {
      deleteGameMutate(gameId);
    }
  };

  const handleAddKey = (gameId: number) => {
    setSelectedGameId(gameId);
    setKeysModalOpen(true);
  };

  const handleKeysSubmit = (keys: string[]) => {
    if (selectedGameId == null) return;
    gameKeyService
      .createGameKeys(selectedGameId, keys)
      .then(() => alert('Ключи успешно добавлены'))
      .catch(() => alert('Ошибка при добавлении ключей'))
      .finally(() => {
        setKeysModalOpen(false);
        setSelectedGameId(null);
      });
  };

  const handleCloseGameModal = () => {
    setGameModalOpen(false);
    setEditGameData(null);
  };

  const handleFormSubmitSuccess = () => {
    // refetchAdminProducts всегда определён
    refetchAdminProducts();
  };

  return (
    <Layout>
      <Meta title="Админ панель - Игры" />
      <Heading classname="mb-7">Игры</Heading>

      <div className="flex mb-4">
        <Button onClick={handleAddGame} variant="orange">
          Добавить игру
        </Button>
      </div>

      <AdminList
        isLoading={isFetching}
        listItems={data}
        removeHandler={handleRemoveGame}
        onAddKey={handleAddKey}
        onEdit={handleEditGameClicked}
      />

      {gameModalOpen && (
        <AddGameModal
          isOpen={gameModalOpen}
          closeModal={handleCloseGameModal}
          initialData={editGameData}
          onFormSubmit={handleFormSubmitSuccess}
        />
      )}

      {keysModalOpen && (
        <AddKeysModal
          isOpen={keysModalOpen}
          onClose={() => {
            setKeysModalOpen(false);
            setSelectedGameId(null);
          }}
          onSubmit={handleKeysSubmit}
        />
      )}
    </Layout>
  );
};

export default Products;
