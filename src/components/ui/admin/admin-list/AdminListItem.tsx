import { FC } from 'react'

import styles from './admin-list.module.scss' // путь поправь по факту
import { IAdminListItem } from './admin-list.interface'
import AdminActions from './admin-actions/AdminActions'

const AdminListItem: FC<IAdminListItem> = ({ removeHandler, listItem }) => {
  return (
    <div className={styles.item}>
      {listItem.items.map(value => (
        <div key={value}>{value}</div>
      ))}

      <AdminActions
        viewUrl={listItem.viewUrl}
        editUrl={listItem.editUrl}
        removeHandler={removeHandler}
      />
    </div>
  )
}

export default AdminListItem
