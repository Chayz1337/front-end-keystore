import { TypeProductDataFilters } from "@/src/assets/styles/services/product/product.types"
import { useActions } from "@/src/hooks/user.actions"
import { useTypedSelector } from "@/src/hooks/useTypedSelector"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"; // ✅ Новый

import { useEffect } from "react"

export const useFilters = () => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { updateQueryParam } = useActions()
    const { replace } = useRouter()

    const { queryParams, isFilterUpdated } = useTypedSelector(
    state => state.filters
    )

    useEffect (() => {
        searchParams.forEach((value, key) => {
            updateQueryParam ({
                key: key as keyof TypeProductDataFilters,
                value
            })
        })
    },[])
    
    const updateQueryParams = (key: keyof TypeProductDataFilters,
        value:string) => {
            const newParams = new URLSearchParams(searchParams.toString())
            if (value) {
                newParams.set(key, String(value))
            } else {
                newParams.delete(key)
            }
            replace(pathname + `?${newParams.toString().replace(/$7C/g, '|')}`)
            updateQueryParam ({key, value})
        };
        return {
            queryParams,
            isFilterUpdated,
            updateQueryParams
        };
}