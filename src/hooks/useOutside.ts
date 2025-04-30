import {
    useEffect,
    useRef,
    useState,
    Dispatch,
    SetStateAction,
    RefObject,
  } from 'react';
  
  type TypeOutside = {
    ref: RefObject<HTMLDivElement>;
    isShow: boolean;
    setIsShow: Dispatch<SetStateAction<boolean>>;
  };
  
  export const useOutside = (initialIsVisible: boolean): TypeOutside => {
    const [isShow, setIsShow] = useState(initialIsVisible);
    const ref = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setIsShow(false);
        }
      };
  
      document.addEventListener('click', handleClickOutside, true);
      return () => {
        document.removeEventListener('click', handleClickOutside, true);
      };
    }, []);
  
    return { ref, isShow, setIsShow };
  };
  