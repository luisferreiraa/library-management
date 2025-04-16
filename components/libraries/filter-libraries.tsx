"use client"

import { useLibraries } from "@/contexts/libraries-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"

export function FilterLibraries() {
    const { filterOptions, activeFilter, setActiveFilter } = useLibraries()

    return (
        <FilterEntities<ActiveFilterOption>
            value={activeFilter}
            onValueChange={setActiveFilter}
            options={filterOptions}
            label="Estado:"
            placeholder="Filtrar Bibliotecas"
        />
    )
}