"use client"

import { usePenaltyRules } from "@/contexts/penaltyrules-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"
import { FilterOption } from "@/lib/filter-options"

type Props = {
    filterOptions: FilterOption<ActiveFilterOption>[]
}

export function FilterPenaltyRules({ filterOptions }: Props) {
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