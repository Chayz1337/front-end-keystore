// src/components/ui/admin/admin-list/AdminList.tsx
import { FC, useState } from 'react'
import AdminListItem from './AdminListItem'
import styles from './admin-list.module.scss'
import Loader from '../../Loader'
import { IListItem } from './admin-list.interface'
import { useMutation } from '@tanstack/react-query'
import { gameKeyService } from '@/src/assets/styles/services/product/game-key.service'
import AddKeysModal from '../../modal/AddKeysModal'


interface IAdminList {
  isLoading: boolean
  listItems?: IListItem[]
  removeHandler?: (id: number) => void
}

const AdminList: FC<IAdminList> = ({ isLoading, removeHandler, listItems = [] }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null)

  const { mutate: addKeys } = useMutation({
    mutationFn: (data: { gameId: number, keys: string[] }) =>
      gameKeyService.createGameKeys(data.gameId, data.keys),
    onSuccess: () => {
      alert('Ключи успешно добавлены')
    },
    onError: () => {
      alert('Ошибка при добавлении ключей')
    }
  })

  const handleAddKey = (gameId: number) => {
    setSelectedGameId(gameId)
    setModalOpen(true)
  }

  const handleModalSubmit = (keys: string[]) => {
    if (selectedGameId !== null) {
      addKeys({ gameId: selectedGameId, keys })
    }
  }

  return (
    <div className={styles.wrapper}>
      <AddKeysModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
      {isLoading ? (
        <Loader />
      ) : listItems.length ? (
        listItems.map((listItem) => (
          <AdminListItem
            key={listItem.id}
            removeHandler={removeHandler ? () => removeHandler(listItem.id) : undefined}
            listItem={listItem}
            onAddKey={handleAddKey}
          />
        ))
      ) : (
        <div className={styles.notFound}>Элементы не найдены</div>
      )}
    </div>
  )
}

export default AdminList
