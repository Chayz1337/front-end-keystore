import { FC } from 'react'
import { useRouter } from 'next/router'
import { RiDeleteRow, RiEdit2Line, RiExternalLinkLine } from 'react-icons/ri'

import styles from './AdminActions.module.scss' 
import { IListItem } from '../admin-list.interface'



interface IAdminActions extends Pick<IListItem, 'editUrl' | 'viewUrl'> {
  removeHandler?: () => void
}

const AdminActions: FC<IAdminActions> = ({ editUrl, viewUrl, removeHandler }) => {
  const { push } = useRouter()

  return (
    <div className={styles.actions}>
      {viewUrl && (
        <button onClick={() => push(viewUrl)}>
          <RiExternalLinkLine />
        </button>
      )}
      {editUrl && (
        <button onClick={() => push(editUrl)}>
          <RiEdit2Line />
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
