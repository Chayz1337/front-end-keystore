// src/components/ui/admin/admin-list/admin-actions/AdminActions.tsx
import { FC } from 'react'
import { useRouter } from 'next/router'
import {
  RiDeleteRow,
  RiEdit2Line,
  RiExternalLinkLine,
  RiKey2Line
} from 'react-icons/ri'
import styles from './AdminActions.module.scss'
import { IListItem } from '../admin-list.interface'

interface IAdminActions extends Pick<IListItem, 'editUrl' | 'viewUrl'> {
  removeHandler?: () => void
  onAddKey?: () => void  // без аргументов
  onEdit?: () => void
}

const AdminActions: FC<IAdminActions> = ({
  viewUrl,
  editUrl,
  removeHandler,
  onAddKey,
  onEdit
}) => {
  const { push } = useRouter()

  return (
    <div className={styles.actions}>
      {viewUrl && (
        <button onClick={() => push(viewUrl)}>
          <RiExternalLinkLine />
        </button>
      )}
      {onEdit && (
        <button onClick={onEdit} title="Редактировать">
          <RiEdit2Line />
        </button>
      )}
      {onAddKey && (
        <button onClick={onAddKey} title="Добавить ключи">
          <RiKey2Line />
        </button>
      )}
      {removeHandler && (
        <button onClick={removeHandler}>
          <RiDeleteRow />
        </button>
      )}
    </div>
  )
}

export default AdminActions
