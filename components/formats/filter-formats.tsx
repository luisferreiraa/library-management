"use client"

import { useFormats } from "@/contexts/formats-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"


export function FilterFormats() {
    const { activeFilter, setActiveFilter } = useFormats()

    const filterOptions = [
        { value: "all", label: "Todos" },
        { value: "active", label: "Ativos" },
        { value: "inactive", label: "Inativos" },
    ] as const

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