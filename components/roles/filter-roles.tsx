"use client"

import { useRoles } from "@/contexts/roles-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"

export function FilterRoles() {
    const { filterOptions, activeFilter, setActiveFilter } = useRoles()

    return (
        <FilterEntities<ActiveFilterOption>
            value={activeFilter}
            onValueChange={setActiveFilter}
            options={filterOptions}
            label="Estado:"
            placeholder="Filtrar Perfis"
        />
    )
}