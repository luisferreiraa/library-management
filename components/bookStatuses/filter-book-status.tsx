"use client"

import { useBookStatuses } from "@/contexts/bookstatus-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"
import { FilterOption } from "@/lib/filter-options"

type Props = {
    filterOptions: FilterOption<ActiveFilterOption>[]
}

export function FilterBookStatus({ filterOptions }: Props) {
    const { activeFilter, setActiveFilter } = useBookStatuses()

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