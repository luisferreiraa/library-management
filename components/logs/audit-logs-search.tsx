"use client"

import { useAuditLogs } from "@/contexts/logs-context"
import { EntitiesSearch } from "../global-entities/entities-search"

export function AuditLogsSearch() {
    const { searchTerm, setSearchTerm } = useAuditLogs()

    return (
        <EntitiesSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Pesquisar logs..."
        />
    )
}

