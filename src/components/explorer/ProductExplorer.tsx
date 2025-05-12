// src/components/explorer/ProductExplorer.tsx
'use client'

import { TypePaginationProducts, IProduct } from "@/src/types/product.interface" // Добавил IProduct
import { FC, useState, useEffect, useRef, useMemo } from "react" // Добавил useMemo
import { useFilters } from "./useFilters"
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/src/assets/styles/services/product/product.service"
import Heading from "../ui/button/Heading"
import Button from "../ui/button/Button"
import styles from './ProductExplorer.module.scss'
import { cn } from "@/src/utils/cn"
import Catalog from "../ui/catalog/Catalog"
import Pagination from "./pagination/Pagination"
import SortDropdown from "../ui/catalog/SortDropdown"
import { EnumProductSort, TypeProductDataFilters } from "@/src/assets/styles/services/product/product.types"
import Filters from "./filters/Filters"
import ProductItemSkeleton from '../ui/catalog/product-item/ProductItemSkeleton';
// import { useDebounce } from "@/src/hooks/useDebounce"; // Дебаунс пока отключим для простоты

interface IProductExplorer {
    initialProducts: TypePaginationProducts
}

const MIN_SKELETON_DISPLAY_TIME = 300;
const CLIENT_SIDE_ITEMS_PER_PAGE = 4; // <-- СКОЛЬКО ПОКАЗЫВАТЬ НА ОДНОЙ КЛИЕНТСКОЙ СТРАНИЦЕ

const ProductExplorer: FC<IProductExplorer> = ({ initialProducts }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { queryParams, updateQueryParams, isFilterUpdated } = useFilters();

    // API будет запрашивать (например) 20 элементов (или сколько в queryParams.perPage)
    // const apiRequestParams = { ...queryParams }; // Пока без дебаунса
    // const debouncedApiRequestParams = useDebounce(apiRequestParams, 500);

    const [isVisuallyLoading, setIsVisuallyLoading] = useState(false);
    const visualLoadingTimerRef = useRef<NodeJS.Timeout | null>(null);
    const prevParamsStringRef = useRef(JSON.stringify(queryParams));

    // Состояние для ТЕКУЩЕЙ КЛИЕНТСКОЙ страницы
    const [currentPageClient, setCurrentPageClient] = useState(1);

    const { data: apiResponseData, isFetching, error, isError } = useQuery<TypePaginationProducts, Error>({
        queryKey: ['product-explorer', JSON.stringify(queryParams)], // Используем queryParams напрямую, без дебаунса
        queryFn: () => {
            console.log('%c[QUERY FN CALLED]', 'color: lime; font-weight: bold', queryParams);
            // Сбрасываем клиентскую страницу при новом API-запросе
            setCurrentPageClient(1);
            return ProductService.getAll(queryParams);
        },
        initialData: initialProducts,
        staleTime: 0, // Для теста: всегда делает запрос при изменении queryParams
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // Эффекты для скелетонов (оставляем как в работающей версии)
    useEffect(() => {
        const currentParamsString = JSON.stringify(queryParams);
        if (isFetching || (currentParamsString !== prevParamsStringRef.current && isFilterUpdated)) {
            setIsVisuallyLoading(true);
            if (visualLoadingTimerRef.current) clearTimeout(visualLoadingTimerRef.current);
            if (currentParamsString !== prevParamsStringRef.current) prevParamsStringRef.current = currentParamsString;
        }
    }, [queryParams, isFetching, isFilterUpdated]);

    useEffect(() => {
      if (isVisuallyLoading && !isFetching && (apiResponseData || isError)) {
        if (visualLoadingTimerRef.current) clearTimeout(visualLoadingTimerRef.current);
        visualLoadingTimerRef.current = setTimeout(() => {
            setIsVisuallyLoading(false);
            visualLoadingTimerRef.current = null;
        }, MIN_SKELETON_DISPLAY_TIME);
      }
      return () => { if (visualLoadingTimerRef.current) clearTimeout(visualLoadingTimerRef.current); };
    }, [isVisuallyLoading, isFetching, apiResponseData, isError]);

    // --- ЛОГИКА ДЛЯ КЛИЕНТСКОЙ ПАГИНАЦИИ ---
    // Все игры, полученные из последнего API-запроса (или initialProducts)
    const allGamesFromApiOrInitial = apiResponseData?.games || initialProducts?.games || [];

    // Общее количество игр, которое у нас ЕСТЬ НА КЛИЕНТЕ
    const totalClientItems = allGamesFromApiOrInitial.length;
    // Количество страниц для КЛИЕНТСКОЙ пагинации
    const numberClientPages = Math.ceil(totalClientItems / CLIENT_SIDE_ITEMS_PER_PAGE);

    // Игры для отображения на ТЕКУЩЕЙ КЛИЕНТСКОЙ странице
    const gamesForCurrentClientPage = useMemo(() => {
        const startIndex = (currentPageClient - 1) * CLIENT_SIDE_ITEMS_PER_PAGE;
        const endIndex = startIndex + CLIENT_SIDE_ITEMS_PER_PAGE;
        return allGamesFromApiOrInitial.slice(startIndex, endIndex);
    }, [allGamesFromApiOrInitial, currentPageClient]);

    console.log('КЛИЕНТСКАЯ ПАГИНАЦИЯ РАСЧЕТ:', {
        totalClientItems, // Общее количество игр, загруженных с API
        CLIENT_SIDE_ITEMS_PER_PAGE,
        numberClientPages, // Количество страниц для этих загруженных игр
        currentPageClient,
        gamesOnCurrentClientPageCount: gamesForCurrentClientPage.length
    });

    const currentSort = (queryParams.sort as EnumProductSort) || EnumProductSort.NEWEST;
    const itemsPerPageForSkeleton = Number(queryParams.perPage) || (isFilterOpen ? 9 : 8);


    return (
        <>
            {/* Заголовок и кнопки (без изменений) */}
             <div className="flex flex-col mb-7">
                <Heading>{queryParams.searchTerm ? `Результаты по "${queryParams.searchTerm}"` : 'Исследуйте игры'}</Heading>
            </div>
            <div className="flex items-center justify-between mb-7">
                <Button variant="white" onClick={() => setIsFilterOpen(!isFilterOpen)} className="transition-colors duration-200">{isFilterOpen ? 'Скрыть фильтры' : 'Открыть фильтры'}</Button>
                <SortDropdown sortType={currentSort} setSortType={(value: EnumProductSort) => { if(!isVisuallyLoading) updateQueryParams('sort', value) }} />
            </div>

            {/* Основной блок */}
            <div className={cn(styles.explorer, { [styles.filterOpened]: isFilterOpen })}>
                <aside className={cn("transition-all duration-300 ease-in-out", { "opacity-100 visible translate-x-0": isFilterOpen, "opacity-0 invisible -translate-x-full pointer-events-none": !isFilterOpen && styles.explorer })}>
                    {isFilterOpen && <Filters />}
                </aside>
                <section>
                    {isVisuallyLoading ? (
                        <div className={cn("grid gap-10", { 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': isFilterOpen, 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4': !isFilterOpen })}>
                            {Array.from({ length: itemsPerPageForSkeleton }).map((_, index) => (<ProductItemSkeleton key={index} />))}
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 my-10">{error.message || 'Ошибка'}</div>
                    ) : (
                        // В каталог передаем игры для ТЕКУЩЕЙ КЛИЕНТСКОЙ СТРАНИЦЫ
                        <Catalog games={gamesForCurrentClientPage} isFilterOpen={isFilterOpen} />
                    )}

                    {/* Условие для пагинации ИСПОЛЬЗУЕТ КЛИЕНТСКИЕ ЗНАЧЕНИЯ */}
                    {!isVisuallyLoading && !error && numberClientPages > 1 && (
                        <Pagination
                            currentPage={currentPageClient.toString()}
                            numberPages={numberClientPages}
                            // При смене страницы ОБНОВЛЯЕМ ТОЛЬКО КЛИЕНТСКУЮ СТРАНИЦУ
                            changePage={page => setCurrentPageClient(Number(page))}
                        />
                    )}
                </section>
            </div>
        </>
    )
}

export default ProductExplorer;