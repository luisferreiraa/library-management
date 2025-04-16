"use client"

import { useLibraryNetworks } from "@/contexts/library-networks-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"
import { FilterOption } from "@/lib/filter-options"

type Props = {
    filterOptions: FilterOption<ActiveFilterOption>[]
}

export function FilterLibraryNetworks({ filterOptions }: Props) {
    const { activeFilter, setActiveFilter } = useLibraryNetworks()

    return (
        <FilterEntities<ActiveFilterOption>
            value={activeFilter}
            onValueChange={setActiveFilter}
            options={filterOptions}
            label="Estado:"
            placeholder="Filtrar Redes de Bibliotecas"
        />
    )
}