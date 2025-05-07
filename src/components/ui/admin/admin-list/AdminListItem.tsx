import { FC } from 'react'
import styles from './admin-list.module.scss'
import { IAdminListItem } from './admin-list.interface'
import AdminActions from './admin-actions/AdminActions'

const AdminListItem: FC<IAdminListItem> = ({ 
  removeHandler, 
  listItem,
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
        gameId={listItem.id}
        onAddKey={() => onAddKey(listItem.id)}
      />
    </div>
  )
}

export default AdminListItem