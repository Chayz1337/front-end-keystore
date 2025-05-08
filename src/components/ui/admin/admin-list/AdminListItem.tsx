// src/components/ui/admin/admin-list/AdminListItem.tsx
import { FC } from 'react'
import styles from './admin-list.module.scss'
import { IAdminListItem } from './admin-list.interface'
import AdminActions from './admin-actions/AdminActions'

const AdminListItem: FC<IAdminListItem> = ({
  listItem,
  removeHandler,
  onEdit,
  onAddKey
}) => {
  return (
    <div className={styles.item}>
      {listItem.items.map((value) => (
        <div key={value}>{value}</div>
      ))}

      <AdminActions
        viewUrl={listItem.viewUrl}
        editUrl={listItem.editUrl}
        removeHandler={removeHandler}
        onEdit={onEdit}
        onAddKey={onAddKey}
      />
    </div>
  )
}

export default AdminListItem
