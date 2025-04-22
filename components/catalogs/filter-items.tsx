"use client"

import { useItems } from "@/contexts/catalog-items-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterItemOption } from "@/types/types"
import { FilterOption, getFilterOptions } from "@/lib/filter-options"
import { useEffect, useState } from "react"

export function FilterItems() {
    const { activeFilter, setActiveFilter } = useItems()
    const [filterOptions, setFilterOtions] = useState<FilterOption<ActiveFilterItemOption>[]>([])

    useEffect(() => {
        async function fetchOptions() {
            const options = await getFilterOptions("items")
            setFilterOtions(options)
        }
        fetchOptions()
    }, [])

    return (
        <FilterEntities<ActiveFilterItemOption>
            value={activeFilter}
            onValueChange={setActiveFilter}
            options={filterOptions}
            label="Tipo:"
            placeholder="Filtrar Itens"
        />
    )
}