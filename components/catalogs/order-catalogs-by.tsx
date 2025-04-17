"use client"

import { OrderEntityBy } from "@/components/global-entities/order-entity-by"
import { useCatalogs } from "@/contexts/catalogs-context"
import type { Catalog } from "@/lib/catalogs"

const sortOptions = [
    { label: "Nome (A-Z)", value: "name", direction: "asc" },
    { label: "Nome (Z-A)", value: "name", direction: "desc" },
    { label: "Data de registo (mais recente)", value: "createdAt", direction: "desc" },
    { label: "Data de registo (mais antiga)", value: "createdAt", direction: "asc" },
] as const

export function OrderCatalogsBy() {
    const { sortOption, setSortOption } = useCatalogs()

    return (
        <OrderEntityBy<Catalog>
            sortOptions={[...sortOptions]}
            currentSort={sortOption}
            onSortChange={setSortOption}
            defaultLabel="Ordenar catálogos por"
        />
    )
}