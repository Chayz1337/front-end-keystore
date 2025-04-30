'use client'

import { TypePaginationProducts } from "@/src/types/product.interface"
import { FC, useState } from "react"
import { useFilters } from "./useFilters"
import { useQuery } from "@tanstack/react-query"
import { ProductService } from "@/src/assets/styles/services/product/product.service"
import Heading from "../ui/button/Heading"
import Button from "../ui/button/Button"
import styles from './ProductExplorer.module.scss'
import { cn } from "@/src/utils/cn"
import Catalog from "../ui/catalog/Catalog"
import Pagination from "./pagination/Pagination"
import SortDropdown from "../ui/catalog/SortDropdown"
import { EnumProductSort } from "@/src/assets/styles/services/product/product.types"
import Filters from "./filters/Filters"
import Loader from "../ui/Loader"


interface IProductExplorer {
    initialProducts: TypePaginationProducts
}

const ProductExplorer: FC<IProductExplorer> = ({ initialProducts }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const { isFilterUpdated, queryParams, updateQueryParams } = useFilters()
    console.log('queryParams', queryParams)
    const { data, isFetching, error } = useQuery<TypePaginationProducts>({
        queryKey: ['product-explorer', queryParams],
        queryFn: () => ProductService.getAll(queryParams),
        initialData: initialProducts,
        enabled: isFilterUpdated,
    })

    const perPage = Number(queryParams.perPage) || 10
    const totalItems = data?.total || 0
    const numberPages = Math.ceil(totalItems / perPage)

    const currentSort = (queryParams.sort as EnumProductSort) || EnumProductSort.NEWEST

    if (error) {
        return <div className="text-center text-red-500">Error loading products!</div> // Обработчик ошибки
    }

    return (
        <>
            <div className="flex flex-col mb-7">
                {/* Заголовок "Explore Products" */}
                <Heading>
                    {queryParams.searchTerm
                        ? `Search results for "${queryParams.searchTerm}"`
                        : 'Explore Products'}
                </Heading>
            </div>

            {/* Контейнер с flex для кнопки и сортировки */}
            <div className="flex items-center justify-between mb-7">
                {/* Кнопка с фильтром слева */}
                <Button
                    variant="white"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                    {isFilterOpen ? 'Close Filters' : 'Open Filters'}
                </Button>

                {/* Сортировка справа */}
                <SortDropdown
                    sortType={currentSort}
                    setSortType={(value: EnumProductSort) => updateQueryParams('sort', value)}
                />
            </div>

            <div className={cn(styles.explorer, {
                [styles.filterOpened]: isFilterOpen
            })}>
                <aside>
                    <Filters />
                </aside>

                <section>
                    {/* Добавим Loader на время загрузки */}
                    {isFetching ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader />
                        </div>
                    ) : (
                        <Catalog games={data?.games || []} />
                    )}

                    {/* Пагинация */}
                    <Pagination
                        changePage={page => updateQueryParams('page', page.toString())}
                        currentPage={queryParams.page}
                        numberPages={numberPages}
                    />
                </section>
            </div>
        </>
    )
}

export default ProductExplorer
