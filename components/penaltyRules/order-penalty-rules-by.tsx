"use client"

import { usePenaltyRules } from "@/contexts/penaltyrules-context"
import { OrderEntityBy } from "../global-entities/order-entity-by"
import { PenaltyRule } from "@prisma/client"

const sortOptions = [
    { label: "Nome (A-Z)", value: "name", direction: "asc" },
    { label: "Nome (Z-A)", value: "name", direction: "desc" },
    { label: "Data de registo (mais recente)", value: "createdAt", direction: "desc" },
    { label: "Data de registo (mais antiga)", value: "createdAt", direction: "asc" },
] as const

export function OrderPenaltyRulesBy() {
    const { sortOption, setSortOption } = usePenaltyRules()

    return (
        <OrderEntityBy<PenaltyRule>
            sortOptions={[...sortOptions]}
            currentSort={sortOption}
            onSortChange={setSortOption}
            defaultLabel="Ordenar regras por"
        />
    )
}

