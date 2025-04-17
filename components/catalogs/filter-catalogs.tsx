"use client"

import { useCatalogs } from "@/contexts/catalogs-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"

export function FilterCatalogs() {
    const { filterOptions, activeFilter, setActiveFilter } = useCatalogs()

    return (
        <FilterEntities<ActiveFilterOption>
            value={activeFilter}
            onValueChange={setActiveFilter}
            options={filterOptions}
            label="Estado:"
            placeholder="Filtrar Catálogos"
        />
    )
}