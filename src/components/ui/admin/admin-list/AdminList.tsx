import { FC } from 'react';

import AdminListItem from './AdminListItem'; // Путь к компоненту AdminListItem

import styles from './admin-list.module.scss'; // Путь к стилям
import Loader from '../../Loader';
import { IListItem } from './admin-list.interface';

interface IAdminList {
  isLoading: boolean;
  listItems?: IListItem[];
  removeHandler?: (id: number) => void;
}

const AdminList: FC<IAdminList> = ({ isLoading, removeHandler, listItems = [] }) => {
  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <Loader />
      ) : listItems.length ? (
        listItems.map((listItem) => (
          <AdminListItem
            key={listItem.id}
            removeHandler={removeHandler ? () => removeHandler(listItem.id) : undefined}
            listItem={listItem}
          />
        ))
      ) : (
        <div className={styles.notFound}>Elements not found</div>
      )}
    </div>
  );
};

export default AdminList;
