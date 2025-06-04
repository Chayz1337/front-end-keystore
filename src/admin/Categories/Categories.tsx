import { useState } from 'react';
import Layout from '@/src/components/ui/layout/Layout';
import Meta from '@/src/components/ui/Meta';
import Heading from '@/src/components/ui/button/Heading';
import Button from '@/src/components/ui/button/Button'; // Added import for Button
import AdminList from '@/src/components/ui/admin/admin-list/AdminList';
import { useAdminCategories } from './useAdminCategories';
import EditCategoryModal from '@/src/components/ui/modal/EditCategoryModal';
import AddCategoryModal from '@/src/components/ui/modal/AddCategoryModal';

const Categories = () => {
  const { data, isFetching, mutate, refetch } = useAdminCategories();
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: number; name: string } | null>(null);

  const handleEdit = (id: number) => {
    const cat = data.find((c) => c.id === id);
    if (!cat) return;
    setSelected({ id, name: cat.items[0] });
    setEditOpen(true);
  };

  return (
    <Layout>
      <Meta title="Админ панель - Категории" />
      
      {/* Heading is now separate */}
      <Heading classname="mb-4">Категории</Heading> 

      {/* Button moved below Heading and styled as requested */}
      <div className="flex mb-4">
        <Button onClick={() => setAddOpen(true)} variant="orange">
          Добавить категорию
        </Button>
      </div>
<div className="max-h-[70vh] overflow-y-auto pr-2">
      <AdminList
        isLoading={isFetching}
        listItems={data}
        removeHandler={mutate}
        onEdit={handleEdit}
      />
</div>
      <EditCategoryModal
        isOpen={editOpen}
        categoryId={selected?.id || null}
        initialName={selected?.name || ''}
        onClose={() => setEditOpen(false)}
        onSuccess={() => {
          refetch();
          setEditOpen(false);
        }}
      />

      <AddCategoryModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={() => {
          refetch();
          setAddOpen(false);
        }}
      />
    </Layout>
  );
};

export default Categories;
