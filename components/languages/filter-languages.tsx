"use client"

import { useLanguages } from "@/contexts/languages-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"

export function FilterLanguages() {
    const { filterOptions, activeFilter, setActiveFilter } = useLanguages()

    return (
        <FilterEntities<ActiveFilterOption>
            value={activeFilter}
            onValueChange={setActiveFilter}
            options={filterOptions}
            label="Estado:"
            placeholder="Filtrar Idiomas"
        />
    )
}