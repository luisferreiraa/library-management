"use client"

import { useUsers } from "@/contexts/users-context"
import { OrderEntityBy } from "../global-entities/order-entity-by"
import { User } from "@prisma/client"

const sortOptions = [
    { label: "Nome de utilizador (A-Z)", value: "username", direction: "asc" },
    { label: "Nome de utilizador (Z-A)", value: "username", direction: "desc" },
    { label: "Email (A-Z)", value: "email", direction: "asc" },
    { label: "Email (Z-A)", value: "email", direction: "desc" },
    { label: "Data de registo (mais recente)", value: "createdAt", direction: "desc" },
    { label: "Data de registo (mais antiga)", value: "createdAt", direction: "asc" },
] as const

export function OrderUsersBy() {
    const { sortOption, setSortOption } = useUsers()

    return (
        <OrderEntityBy<User>
            sortOptions={[...sortOptions]}
            currentSort={sortOption}
            onSortChange={setSortOption}
            defaultLabel="Ordenar utilizadores por"
        />
    )
}

