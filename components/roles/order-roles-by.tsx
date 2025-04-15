"use client"

import { useRoles } from "@/contexts/roles-context"
import { OrderEntityBy } from "../global-entities/order-entity-by"
import { Role } from "@prisma/client"

const sortOptions = [
    { label: "Nome (A-Z)", value: "name", direction: "asc" },
    { label: "Nome (Z-A)", value: "name", direction: "desc" },
    { label: "Data de registo (mais recente)", value: "createdAt", direction: "desc" },
    { label: "Data de registo (mais antiga)", value: "createdAt", direction: "asc" },
] as const

export function OrderRolesBy() {
    const { sortOption, setSortOption } = useRoles()

    return (
        <OrderEntityBy<Role>
            sortOptions={[...sortOptions]}
            currentSort={sortOption}
            onSortChange={setSortOption}
            defaultLabel="Ordenar idiomas por"
        />
    )
}

