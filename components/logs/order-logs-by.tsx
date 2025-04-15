"use client"

import { useAuditLogs } from "@/contexts/logs-context"
import { OrderEntityBy } from "../global-entities/order-entity-by"
import { AuditLogWithRelations } from "@/lib/auditlogs"

const sortOptions = [
    { label: "Entidade (A-Z)", value: "entity", direction: "asc" },
    { label: "Entidade (Z-A)", value: "entity", direction: "desc" },
    { label: "Data de registo (mais recente)", value: "timestamp", direction: "desc" },
    { label: "Data de registo (mais antiga)", value: "timestamp", direction: "asc" },
] as const

export function OrderLogsBy() {
    const { sortOption, setSortOption } = useAuditLogs()

    return (
        <OrderEntityBy<AuditLogWithRelations>
            sortOptions={[...sortOptions]}
            currentSort={sortOption}
            onSortChange={setSortOption}
            defaultLabel="Ordenar logs por"
        />
    )
}

