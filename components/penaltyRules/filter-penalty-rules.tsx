"use client"

import { usePenaltyRules } from "@/contexts/penaltyrules-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"

export function FilterPenaltyRules() {
    const { filterOptions, activeFilter, setActiveFilter } = usePenaltyRules()

    return (
        <FilterEntities<ActiveFilterOption>
            value={activeFilter}
            onValueChange={setActiveFilter}
            options={filterOptions}
            label="Estado:"
            placeholder="Filtrar Regras"
        />
    )
}