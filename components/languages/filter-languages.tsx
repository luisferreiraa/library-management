"use client"

import { useLanguages } from "@/contexts/languages-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"
import { FilterOption } from "@/lib/filter-options"

type Props = {
    filterOptions: FilterOption<ActiveFilterOption>[]
}

export function FilterLanguages({ filterOptions }: Props) {
    const { activeFilter, setActiveFilter } = useLanguages()

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