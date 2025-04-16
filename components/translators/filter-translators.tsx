"use client"

import { useTranslators } from "@/contexts/translators-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"
import { FilterOption } from "@/lib/filter-options"

type Props = {
    filterOptions: FilterOption<ActiveFilterOption>[]
}

export function FilterTranslators({ filterOptions }: Props) {
    const { activeFilter, setActiveFilter } = useTranslators()

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