"use client"

import { useFormats } from "@/contexts/formats-context"
import { OrderEntityBy } from "../global-entities/order-entity-by"
import { Format } from "@prisma/client"

const sortOptions = [
    { label: "Nome (A-Z)", value: "name", direction: "asc" },
    { label: "Nome (Z-A)", value: "name", direction: "desc" },
    { label: "Data de registo (mais recente)", value: "createdAt", direction: "desc" },
    { label: "Data de registo (mais antiga)", value: "createdAt", direction: "asc" },
] as const

export function OrderFormatsBy() {
    const { sortOption, setSortOption } = useFormats()

    return (
        <OrderEntityBy<Format>
            sortOptions={[...sortOptions]}
            currentSort={sortOption}
            onSortChange={setSortOption}
            defaultLabel="Ordenar formatos por"
        />
    )
}

