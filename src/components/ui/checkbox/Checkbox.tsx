// src/components/ui/checkbox/Checkbox.tsx
import { cn } from "@/src/utils/cn"
import { FC, PropsWithChildren } from "react"
import styles from "./Checkbox.module.scss"

interface ICheckBox {
  isChecked: boolean
  onClick: () => void
  className?: string
}

const Checkbox: FC<PropsWithChildren<ICheckBox>> = ({
  isChecked,
  onClick,
  className,
  children
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        styles.checkbox,
        "w-full flex items-center", // вот тут
        className
      )}
    >
      <span
        className={cn(
          styles.box,
          { [styles.active]: isChecked }
        )}
      />
      <span className="ml-2">{children}</span>
    </button>
  )
}

export default Checkbox
