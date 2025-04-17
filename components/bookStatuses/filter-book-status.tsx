"use client"

import { useBookStatus } from "@/contexts/bookstatus-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"

export function FilterBookStatus() {
    const { filterOptions, activeFilter, setActiveFilter } = useBookStatus()

    return (
        <FilterEntities<ActiveFilterOption>
            value={activeFilter}
            onValueChange={setActiveFilter}
            options={filterOptions}
            label="Estado:"
            placeholder="Filtrar Estados"
        />
    )
}