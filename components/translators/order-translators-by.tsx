"use client"

import { useTranslators } from "@/contexts/translators-context"
import { OrderEntityBy } from "../global-entities/order-entity-by"
import { Translator } from "@prisma/client"

const sortOptions = [
    { label: "Nome (A-Z)", value: "name", direction: "asc" },
    { label: "Nome (Z-A)", value: "name", direction: "desc" },
    { label: "Data de registo (mais recente)", value: "createdAt", direction: "desc" },
    { label: "Data de registo (mais antiga)", value: "createdAt", direction: "asc" },
] as const

export function OrderTranslatorsBy() {
    const { sortOption, setSortOption } = useTranslators()

    return (
        <OrderEntityBy<Translator>
            sortOptions={[...sortOptions]}
            currentSort={sortOption}
            onSortChange={setSortOption}
            defaultLabel="Ordenar tradutores por"
        />
    )
}

