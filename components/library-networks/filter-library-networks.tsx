"use client"

import { useLibraryNetworks } from "@/contexts/library-networks-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"

const filterOptions = [
    { value: "all", label: "Todas" },
    { value: "active", label: "Ativas" },
    { value: "inactive", label: "Inativas" },
] as const

export function FilterLibraryNetworks() {
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