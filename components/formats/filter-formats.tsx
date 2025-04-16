"use client"

import { useFormats } from "@/contexts/formats-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"

export function FilterFormats() {
    const { filterOptions, activeFilter, setActiveFilter } = useFormats()

    return (
        <FilterEntities<ActiveFilterOption>
            value={activeFilter}
            onValueChange={setActiveFilter}
            options={filterOptions}
            label="Estado:"
            placeholder="Filtrar Formatos"
        />
    )
}