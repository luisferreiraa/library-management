"use client"

import { useCategories } from "@/contexts/categories-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"

const filterOptions = [
    { value: "all", label: "Todos" },
    { value: "active", label: "Ativas" },
    { value: "inactive", label: "Inativas" },
] as const

export function FilterCategories() {
    const { activeFilter, setActiveFilter } = useCategories()

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