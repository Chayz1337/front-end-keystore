// src/components/ui/admin/AddKeysModal.tsx
import { FC, useState } from 'react'
import styles from './AddKeysModal.module.scss'

interface IAddKeysModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (keys: string[]) => void
}

const AddKeysModal: FC<IAddKeysModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [text, setText] = useState('')

  if (!isOpen) return null

  const handleSubmit = () => {
    const keys = text
      .split('\n')
      .map(k => k.trim())
      .filter(k => k.length > 0)

    if (keys.length > 0) {
      onSubmit(keys)
      setText('')
      onClose()
    } else {
      alert('Введите хотя бы один ключ')
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Добавить ключи</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Один ключ на строку"
        />
        <div className={styles.actions}>
          <button onClick={handleSubmit}>Добавить</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  )
}

export default AddKeysModal
