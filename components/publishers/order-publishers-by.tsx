"use client"

import { usePublishers } from "@/contexts/publishers-context"
import { OrderEntityBy } from "../global-entities/order-entity-by"
import { Publisher } from "@prisma/client"

const sortOptions = [
    { label: "Nome (A-Z)", value: "name", direction: "asc" },
    { label: "Nome (Z-A)", value: "name", direction: "desc" },
    { label: "Data de registo (mais recente)", value: "createdAt", direction: "desc" },
    { label: "Data de registo (mais antiga)", value: "createdAt", direction: "asc" },
] as const

export function OrderPublishersBy() {
    const { sortOption, setSortOption } = usePublishers()

    return (
        <OrderEntityBy<Publisher>
            sortOptions={[...sortOptions]}
            currentSort={sortOption}
            onSortChange={setSortOption}
            defaultLabel="Ordenar editoras por"
        />
    )
}

