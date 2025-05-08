// src/components/ui/admin/admin-list/AdminList.tsx
import { FC, useState } from 'react'
import AdminListItem from './AdminListItem'
import styles from './admin-list.module.scss'
import Loader from '../../Loader'
import { IAdminList } from './admin-list.interface'
import AddKeysModal from '../../modal/AddKeysModal'
import { gameKeyService } from '@/src/assets/styles/services/product/game-key.service'

const AdminList: FC<IAdminList> = ({
  isLoading,
  listItems = [],
  removeHandler,
  onEdit,
  onAddKey
}) => {
  const [keysModalOpen, setKeysModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleKeysSubmit = (keys: string[]) => {
    if (selectedId !== null) {
      gameKeyService
        .createGameKeys(selectedId, keys)
        .then(() => alert('Ключи успешно добавлены'))
        .catch(() => alert('Ошибка при добавлении ключей'))
        .finally(() => setKeysModalOpen(false))
    }
  }

  return (
    <div className={styles.wrapper}>
      <AddKeysModal
        isOpen={keysModalOpen}
        onClose={() => setKeysModalOpen(false)}
        onSubmit={handleKeysSubmit}
      />

      {isLoading ? (
        <Loader />
      ) : listItems.length ? (
        listItems.map((item) => (
          <AdminListItem
            key={item.id}
            listItem={item}
            removeHandler={removeHandler ? () => removeHandler(item.id) : undefined}
            onEdit={onEdit ? () => onEdit(item.id) : undefined}
            onAddKey={
              onAddKey
                ? () => {
                    setSelectedId(item.id)
                    setKeysModalOpen(true)
                  }
                : undefined
            }
          />
        ))
      ) : (
        <div className={styles.notFound}>Элементы не найдены</div>
      )}
    </div>
  )
}

export default AdminList
