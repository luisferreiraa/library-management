"use client"

import { useItems } from "@/contexts/catalog-items-context"
import { OrderEntityBy } from "../global-entities/order-entity-by"
import { CatalogItem } from "@prisma/client"
import { SortOption } from "@/types/types"

const sortOptions: (SortOption<CatalogItem> & { label: string })[] = [
    { label: "Título (A-Z)", value: "title", direction: "asc" },
    { label: "Título (Z-A)", value: "title", direction: "desc" },
    { label: "Data de registo (mais recente)", value: "createdAt", direction: "desc" },
    { label: "Data de registo (mais antiga)", value: "createdAt", direction: "asc" },
]

export function OrderItemsBy() {
    const { sortOption, setSortOption } = useItems()

    return (
        <OrderEntityBy<CatalogItem>
            sortOptions={[...sortOptions]}
            currentSort={sortOption}
            onSortChange={setSortOption}
            defaultLabel="Ordenar itens por"
        />
    )
}