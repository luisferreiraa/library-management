"use client"

import { useAuthors } from "@/contexts/authors-context"
import { OrderEntityBy } from "../global-entities/order-entity-by"
import { Author } from "@prisma/client"

const sortOptions = [
    { label: "Nome (A-Z)", value: "name", direction: "asc" },
    { label: "Nome (Z-A)", value: "name", direction: "desc" },
    { label: "Data de registo (mais recente)", value: "createdAt", direction: "desc" },
    { label: "Data de registo (mais antiga)", value: "createdAt", direction: "asc" },
] as const

export function OrderAuthorsBy() {
    const { sortOption, setSortOption } = useAuthors()

    return (
        <OrderEntityBy<Author>
            sortOptions={[...sortOptions]}
            currentSort={sortOption}
            onSortChange={setSortOption}
            defaultLabel="Ordenar idiomas por"
        />
    )
}

