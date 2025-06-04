// src/components/layout/header/Search.tsx
import { FC, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery, QueryKey } from "@tanstack/react-query";
import Image from "next/image";
import { ProductService, ISearchSuggestion } from "@/src/assets/styles/services/product/product.service"; // Ensure this path is correct
import { useDebounce } from "@/src/hooks/useDebounce"; // Ensure this path is correct
import styles from '../header/search.module.scss'; // Ensure this path is correct

const Search: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<ISearchSuggestion[]>([]);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  type SearchSuggestionsQueryKey = readonly ['search suggestions', string];

  const {
    data: fetchedSuggestions,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery<
    ISearchSuggestion[],
    Error,
    ISearchSuggestion[],
    SearchSuggestionsQueryKey
  >({
    queryKey: ['search suggestions', debouncedSearchTerm] as SearchSuggestionsQueryKey,
    queryFn: async ({ queryKey }) => {
      const [_key, termToSearch] = queryKey;
      if (!termToSearch || !termToSearch.trim() || termToSearch.length <= 1) {
        return [];
      }
      return ProductService.getSearchSuggestions(termToSearch);
    },
    enabled: !!debouncedSearchTerm && debouncedSearchTerm.trim().length > 1 && showSuggestions,
  });

  useEffect(() => {
    if (isSuccess && fetchedSuggestions) {
      setCurrentSuggestions(fetchedSuggestions);
    }
  }, [isSuccess, fetchedSuggestions]);

  useEffect(() => {
    if (isError && error) {
      console.error("Error fetching suggestions:", error.message);
      setCurrentSuggestions([]);
    }
  }, [isError, error]);


  const handleSearch = () => {
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      setCurrentSuggestions([]);
      router.push(`/q?term=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim().length > 1) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setCurrentSuggestions([]);
    }
  };

  const handleSuggestionClick = (slug: string) => {
    setSearchTerm('');
    setShowSuggestions(false);
    setCurrentSuggestions([]);
    router.push(`/games/${slug}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatPrice = (price: number) => {
    return price + ' ₽';
  };

  return (
    <div className="mb-3 ml-5 mt-9 relative" ref={searchContainerRef}>
      <div className="relative mb-1 flex flex-wrap items-stretch">
        <input
          type="search"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => {
            if (searchTerm.trim().length > 1) {
                setShowSuggestions(true);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
          // Assuming 'bg-while' is a custom class for white or a light theme background
          className="bg-while relative text-black m-0 -mr-0.5 block w-80 rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding
          px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3]
            focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200
            dark:placeholder:text-neutral-200 dark:focus:border-primary"
          placeholder="Поиск игры..."
          aria-label="Search"
          aria-describedby="button-addon1"
        />
        <button
          // Assuming 'text-while' is a custom class for white or a light theme text color
          className="relative z-[2] flex items-center rounded-r bg-primary px-6 py-2.5 text-xs font-medium uppercase
           leading-tight text-while shadow-md transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none
           focus:ring-0 active:bg-primary-800 active:shadow-lg"
          type="button"
          id="button-addon1"
          onClick={handleSearch}
          aria-label="Найти"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {showSuggestions && (debouncedSearchTerm.trim().length > 1) && (
        <ul
          // REMOVED hover:text-aqua from here
          // Assuming 'bg-while' is a custom class for white or a light theme background for the dropdown
          className={`absolute z-50 w-[calc(100%-41.5rem)] 
                     max-h-80 overflow-y-auto bg-while border border-neutral-300 rounded-md shadow-lg
                     dark:bg-neutral-800 dark:border-neutral-700 mt-1
                     ${styles.animateSmoothOpen}`}
          style={{
            left: 0,
            top: '100%',
           }}
        >
          {isLoading && <li className="px-4 py-2 text-neutral-500 dark:text-neutral-400">Загрузка...</li>}
          {isError && <li className="px-4 py-2 text-red-500">Ошибка загрузки</li>}
          {isSuccess && !isLoading && currentSuggestions.length === 0 && debouncedSearchTerm.trim().length > 1 && (
            <li className="px-4 py-2 text-neutral-500 dark:text-neutral-400">Ничего не найдено</li>
          )}
          {isSuccess && !isLoading && currentSuggestions.map((game) => (  
            <li
              key={game.slug}
              // ADDED hover:text-aqua here (or your specific aqua text color class)
              // Also, ensure 'text-aqua' is defined in your CSS/Tailwind config if it's custom.
              // If 'aqua' is from styles.animateSmoothOpen or another module, ensure it targets text color on hover.
              className="px-2 py-2 hover:bg-neutral-100 hover:text-aqua dark:hover:bg-neutral-700 dark:hover:text-sky-400 cursor-pointer border-b border-neutral-200 dark:border-neutral-600 last:border-b-0"
              onClick={() => handleSuggestionClick(game.slug)}
              onMouseDown={(e) => e.preventDefault()} // Prevents input blur on click
            >
              <div className="flex items-center space-x-3">
                {game.image && (
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={game.image}
                      alt={game.name}
                      fill
                      sizes="48px"
                      className="rounded object-cover"
                    />
                  </div>
                )}
                <div className="flex-grow min-w-0">
                  <div className="font-medium text-sm text-neutral-800 dark:text-neutral-200 truncate">
                    {game.name}
                  </div>
                  <div className="text-xs mt-1">
                    {/* @ts-ignore: Check if discountedPrice exists */}
                    {typeof game.discountedPrice === 'number' && game.discountedPrice < game.price ? (
                      <>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {/* @ts-ignore */}
                          {formatPrice(game.discountedPrice)}
                        </span>
                        <span className="ml-2 text-neutral-500 dark:text-neutral-400 line-through">
                          {formatPrice(game.price)}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-neutral-700 dark:text-neutral-300">
                        {formatPrice(game.price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;