"use client"

import { useLibraries } from "@/contexts/libraries-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"
import { FilterOption } from "@/lib/filter-options"

type Props = {
    filterOptions: FilterOption<ActiveFilterOption>[]
}

export function FilterLibraries({ filterOptions }: Props) {
    const { activeFilter, setActiveFilter } = useLibraries()

    return (
        <FilterEntities<ActiveFilterOption>
            value={activeFilter}
            onValueChange={setActiveFilter}
            options={filterOptions}
            label="Estado:"
            placeholder="Filtrar Bibliotecas"
        />
    )
}