  import { useEffect, useState } from "react";

  export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Очистка таймера при размонтировании или если value/delay изменятся до срабатывания
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]); // Перезапускаем эффект, если value или delay изменились

    return debouncedValue;
  };