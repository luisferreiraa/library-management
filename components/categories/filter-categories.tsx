"use client"

import { useCategories } from "@/contexts/categories-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"

export function FilterCategories() {
    const { filterOptions, activeFilter, setActiveFilter } = useCategories()

    return (
        <FilterEntities<ActiveFilterOption>
            value={activeFilter}
            onValueChange={setActiveFilter}
            options={filterOptions}
            label="Estado:"
            placeholder="Filtrar Categorias"
        />
    )
}