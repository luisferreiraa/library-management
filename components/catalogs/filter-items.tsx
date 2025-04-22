"use client"

import { useItems } from "@/contexts/catalog-items-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"
import { FilterOption, getFilterOptions } from "@/lib/filter-options"
import { useEffect, useState } from "react"

export function FilterItems() {
    const { activeFilter, setActiveFilter } = useItems()
    const [filterOptions, setFilterOtions] = useState<FilterOption<ActiveFilterOption>[]>([])

    useEffect(() => {
        async function fetchOptions() {
            const options = await getFilterOptions("items")
            setFilterOtions(options)
        }
        fetchOptions()
    }, [])

    return (
        <FilterEntities<ActiveFilterOption>
            value={activeFilter}
            onValueChange={setActiveFilter}
            options={filterOptions}
            label="Estado:"
            placeholder="Filtrar Itens"
        />
    )
}