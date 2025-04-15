"use client"

import { useLanguages } from "@/contexts/languages-context"
import { OrderEntityBy } from "../global-entities/order-entity-by"
import { Language } from "@prisma/client"

const sortOptions = [
    { label: "Nome (A-Z)", value: "name", direction: "asc" },
    { label: "Nome (Z-A)", value: "name", direction: "desc" },
    { label: "Data de registo (mais recente)", value: "createdAt", direction: "desc" },
    { label: "Data de registo (mais antiga)", value: "createdAt", direction: "asc" },
] as const

export function OrderLanguagesBy() {
    const { sortOption, setSortOption } = useLanguages()

    return (
        <OrderEntityBy<Language>
            sortOptions={[...sortOptions]}
            currentSort={sortOption}
            onSortChange={setSortOption}
            defaultLabel="Ordenar idiomas por"
        />
    )
}

