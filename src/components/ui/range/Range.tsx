import { useDebounce } from "@/src/hooks/useDebounce"
import { FC, useEffect, useState } from "react"
import styles from './Range.module.scss'

interface IRange {
    min?: number
    max: number
    fromInitialValue?: string
    toInitialValue?: string
    OnChangeFromValue: (value: string) => void
    OnChangeToValue: (value: string) => void
}

const Range: FC<IRange> = ({
    max,
    OnChangeFromValue,
    OnChangeToValue,
    fromInitialValue,
    toInitialValue,
    min = 0
}) => {
    const [fromValue, setFromValue] = useState(fromInitialValue || '')
    const [toValue, setToValue] = useState(toInitialValue || '')

    const debouncedFromValue = useDebounce(fromValue, 500)
    const debouncedToValue = useDebounce(toValue, 500)
    
    useEffect(() => {
        OnChangeFromValue(debouncedFromValue)
    }, [debouncedFromValue])
    
    useEffect(() => {
        OnChangeToValue(debouncedToValue)
    }, [debouncedToValue])

    return (
        <div className={styles.range}>
            <input
                min={min}
                max={max}
                type="number"
                placeholder="От"
                value={fromValue}
                onChange={e => setFromValue(e.target.value)}
            />
            <span className={styles.separator}> - </span>
            <input
                min={min}
                max={max}
                type="number"
                placeholder="До"
                value={toValue}
                onChange={e => setToValue(e.target.value)}
            />
        </div>
    )
}

export default Range