// src/components/ui/admin/admin-list/admin-list.interface.ts
export interface IListItem {
  id: number
  editUrl?: string
  viewUrl?: string
  items: string[]
}

export interface IAdminList {
  isLoading: boolean
  listItems?: IListItem[]
  removeHandler?: (id: number) => void    // Удаление
  onEdit?: (id: number) => void           // Редактирование
  onAddKey?: (id: number) => void         // Добавление ключей (для игр)
}

export interface IAdminListItem {
  listItem: IListItem
  removeHandler?: () => void
  onEdit?: () => void
  onAddKey?: () => void
}
