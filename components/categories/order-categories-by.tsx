"use client"

import { useCategories } from "@/contexts/categories-context"
import { OrderEntityBy } from "../global-entities/order-entity-by"
import { Category } from "@prisma/client"

const sortOptions = [
    { label: "Nome (A-Z)", value: "name", direction: "asc" },
    { label: "Nome (Z-A)", value: "name", direction: "desc" },
    { label: "Data de registo (mais recente)", value: "createdAt", direction: "desc" },
    { label: "Data de registo (mais antiga)", value: "createdAt", direction: "asc" },
] as const

export function OrderCategoriesBy() {
    const { sortOption, setSortOption } = useCategories()

    return (
        <OrderEntityBy<Category>
            sortOptions={[...sortOptions]}
            currentSort={sortOption}
            onSortChange={setSortOption}
            defaultLabel="Ordenar categorias por"
        />
    )
}

