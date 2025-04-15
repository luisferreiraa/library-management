"use client"

import { useBookStatuses } from "@/contexts/bookstatus-context"
import { OrderEntityBy } from "../global-entities/order-entity-by"
import { BookStatus } from "@prisma/client"

const sortOptions = [
    { label: "Nome (A-Z)", value: "name", direction: "asc" },
    { label: "Nome (Z-A)", value: "name", direction: "desc" },
    { label: "Data de registo (mais recente)", value: "createdAt", direction: "desc" },
    { label: "Data de registo (mais antiga)", value: "createdAt", direction: "asc" },
] as const

export function OrderBookStatusBy() {
    const { sortOption, setSortOption } = useBookStatuses()

    return (
        <OrderEntityBy<BookStatus>
            sortOptions={[...sortOptions]}
            currentSort={sortOption}
            onSortChange={setSortOption}
            defaultLabel="Ordenar idiomas por"
        />
    )
}

