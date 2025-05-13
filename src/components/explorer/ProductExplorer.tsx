// src/components/explorer/ProductExplorer.tsx
'use client'

import { TypePaginationProducts, IProduct } from "@/src/types/product.interface"
import { FC, useState, useEffect, useRef, useMemo } from "react"
import { useFilters } from "./useFilters"
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/src/assets/styles/services/product/product.service"
import Heading from "../ui/button/Heading" // Предположим, что это ui/Heading
import Button from "../ui/button/Button"
import styles from './ProductExplorer.module.scss'
import { cn } from "@/src/utils/cn"
import Catalog from "../ui/catalog/Catalog"
import Pagination from "./pagination/Pagination"
import SortDropdown from "../ui/catalog/SortDropdown" // Предположим, что это ui/SortDropdown
import { EnumProductSort } from "@/src/assets/styles/services/product/product.types" // Убрал TypeProductDataFilters, если не используется
import Filters from "./filters/Filters"
import ProductItemSkeleton from '../ui/catalog/product-item/ProductItemSkeleton';

interface IProductExplorer {
    initialProducts: TypePaginationProducts
}

const MIN_SKELETON_DISPLAY_TIME = 300;
// УБИРАЕМ КОНСТАНТУ CLIENT_SIDE_ITEMS_PER_PAGE ОТСЮДА

const ProductExplorer: FC<IProductExplorer> = ({ initialProducts }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { queryParams, updateQueryParams, isFilterUpdated } = useFilters();

    const [isVisuallyLoading, setIsVisuallyLoading] = useState(false);
    const visualLoadingTimerRef = useRef<NodeJS.Timeout | null>(null);
    const prevParamsStringRef = useRef(JSON.stringify(queryParams));
    const [currentPageClient, setCurrentPageClient] = useState(1);

    // --- ДИНАМИЧЕСКОЕ КОЛИЧЕСТВО ЭЛЕМЕНТОВ НА КЛИЕНТСКОЙ СТРАНИЦЕ ---
    const itemsPerPageClient = useMemo(() => {
        return isFilterOpen ? 9 : 8; // <-- ИЗМЕНЕНИЕ ЗДЕСЬ: было 8, теперь 9 при закрытых
        // Если хочешь, чтобы при открытых было, например, 6 (2 ряда по 3), а при закрытых 9 (3 ряда по 3):
        // return isFilterOpen ? 6 : 9;
        // Твоё требование: "когда сворачиваю фильтры хочу 9 игр на странице"
        // "когда открываю фильтры у меня сжимается до 3 в ширину и до 8 макс на странице"
        // Если при открытых фильтрах ты хочешь до 8, то:
        // return isFilterOpen ? 8 : 9;
        // Судя по твоему описанию, ты хочешь 9 при закрытых и до 8 при открытых (если их 3 в ряд, то это может быть 3 или 6)
        // Давай для начала сделаем: если фильтры открыты (3 колонки), то 6 элементов (2 ряда). Если закрыты - 9.
        // Это значение будет влиять на то, сколько элементов берется для ОДНОЙ КЛИЕНТСКОЙ страницы.
        // API все равно будет запрашивать queryParams.perPage
        return isFilterOpen ? 6 : 9; // <--- ПОПРОБУЙ ТАК
    }, [isFilterOpen]);


    const { data: apiResponseData, isFetching, error, isError } = useQuery<TypePaginationProducts, Error>({
        queryKey: ['product-explorer', JSON.stringify(queryParams)],
        queryFn: () => {
            console.log('%c[QUERY FN CALLED]', 'color: lime; font-weight: bold', queryParams);
            setCurrentPageClient(1); // Сбрасываем клиентскую страницу при новом API-запросе
            return ProductService.getAll(queryParams);
        },
        initialData: initialProducts,
        staleTime: 0,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // Эффект для сброса клиентской страницы при изменении itemsPerPageClient
    // (т.е. при открытии/закрытии фильтров, если это меняет itemsPerPageClient)
    useEffect(() => {
        setCurrentPageClient(1);
    }, [itemsPerPageClient]);


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


    const allGamesFromApiOrInitial = apiResponseData?.games || initialProducts?.games || [];
    const totalClientItems = allGamesFromApiOrInitial.length;

    // Используем itemsPerPageClient для расчета количества клиентских страниц
    const numberClientPages = Math.ceil(totalClientItems / itemsPerPageClient);

    const gamesForCurrentClientPage = useMemo(() => {
        const startIndex = (currentPageClient - 1) * itemsPerPageClient;
        const endIndex = startIndex + itemsPerPageClient;
        return allGamesFromApiOrInitial.slice(startIndex, endIndex);
    }, [allGamesFromApiOrInitial, currentPageClient, itemsPerPageClient]); // Добавил itemsPerPageClient в зависимости


    const currentSort = (queryParams.sort as EnumProductSort) || EnumProductSort.NEWEST;
    // Количество скелетонов должно соответствовать тому, сколько мы запрашиваем у API,
    // или itemsPerPageClient, если он больше. Но лучше ориентироваться на queryParams.perPage
    const itemsPerPageForSkeleton = Number(queryParams.perPage) || itemsPerPageClient;


    return (
        <>
             <div className="flex flex-col mb-7">
                <Heading>{queryParams.searchTerm ? `Результаты по "${queryParams.searchTerm}"` : '🎮Игры'}</Heading>
            </div>
            <div className="flex items-center justify-between mb-7">
                <Button variant="white" onClick={() => setIsFilterOpen(!isFilterOpen)} className="transition-colors duration-200">{isFilterOpen ? 'Скрыть фильтры' : 'Открыть фильтры'}</Button>
                <SortDropdown sortType={currentSort} setSortType={(value: EnumProductSort) => { if(!isVisuallyLoading) updateQueryParams('sort', value) }} />
            </div>

            <div className={cn(styles.explorer, { [styles.filterOpened]: isFilterOpen })}>
                <aside className={cn("transition-all duration-300 ease-in-out", { "opacity-100 visible translate-x-0": isFilterOpen, "opacity-0 invisible -translate-x-full pointer-events-none": !isFilterOpen && styles.explorer })}>
                    {isFilterOpen && <Filters />}
                </aside>
                <section>
                    {isVisuallyLoading ? (
                        <div className={cn("grid gap-10", { 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': isFilterOpen, 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4': !isFilterOpen })}>
                            {/* Количество скелетонов должно соответствовать itemsPerPageClient или запрошенному perPage */}
                            {Array.from({ length: itemsPerPageForSkeleton }).map((_, index) => (<ProductItemSkeleton key={index} />))}
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 my-10">{error.message || 'Ошибка'}</div>
                    ) : (
                        <Catalog games={gamesForCurrentClientPage} isFilterOpen={isFilterOpen} />
                    )}

                    {!isVisuallyLoading && !error && gamesForCurrentClientPage.length > 0 && numberClientPages > 1 && (
                        <Pagination
                            currentPage={currentPageClient.toString()}
                            numberPages={numberClientPages}
                            changePage={page => setCurrentPageClient(Number(page))}
                        />
                    )}
                </section>
            </div>
        </>
    )
}

export default ProductExplorer;