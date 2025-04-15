"use client"

import { OrderEntityBy } from "@/components/global-entities/order-entity-by"
import { useLibraries } from "@/contexts/libraries-context"
import type { Library } from "@/lib/libraries"

const sortOptions = [
    { label: "Nome (A-Z)", value: "name", direction: "asc" },
    { label: "Nome (Z-A)", value: "name", direction: "desc" },
    { label: "Data de registo (mais recente)", value: "createdAt", direction: "desc" },
    { label: "Data de registo (mais antiga)", value: "createdAt", direction: "asc" },
] as const

export function OrderLibrariesBy() {
    const { sortOption, setSortOption } = useLibraries()

    return (
        <OrderEntityBy<Library>
            sortOptions={[...sortOptions]}
            currentSort={sortOption}
            onSortChange={setSortOption}
            defaultLabel="Ordenar bibliotecas por"
        />
    )
}