"use client"

import { usePenaltyRules } from "@/contexts/penaltyrules-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"

const filterOptions = [
    { value: "all", label: "Todas" },
    { value: "active", label: "Ativas" },
    { value: "inactive", label: "Inativas" },
] as const

export function FilterPenaltyRules() {
    const { activeFilter, setActiveFilter } = usePenaltyRules()

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