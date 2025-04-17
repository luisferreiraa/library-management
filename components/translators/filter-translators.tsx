"use client"

import { useTranslators } from "@/contexts/translators-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"

export function FilterTranslators() {
    const { filterOptions, activeFilter, setActiveFilter } = useTranslators()

    return (
        <FilterEntities<ActiveFilterOption>
            value={activeFilter}
            onValueChange={setActiveFilter}
            options={filterOptions}
            label="Estado:"
            placeholder="Filtrar Tradutores"
        />
    )
}