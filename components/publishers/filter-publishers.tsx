"use client"

import { usePublishers } from "@/contexts/publishers-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"

export function FilterPublishers() {
    const { filterOptions, activeFilter, setActiveFilter } = usePublishers()

    return (
        <FilterEntities<ActiveFilterOption>
            value={activeFilter}
            onValueChange={setActiveFilter}
            options={filterOptions}
            label="Estado:"
            placeholder="Filtrar Editorasd"
        />
    )
}