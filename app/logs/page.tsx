import { Suspense } from "react"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { getAuditLogs } from "@/lib/auditlogs"
import { AuditLogsProvider } from "@/contexts/logs-context"
import { AuditLogsSearch } from "@/components/logs/audit-logs-search"
import { AuditLogsTable } from "@/components/logs/audit-logs-table"

export default async function AuditLogsPage() {
    // Buscar dados no servidor
    const auditLogs = await getAuditLogs()

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <AuditLogsProvider initialAuditLogs={auditLogs}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
                </div>

                <div className="mb-6 max-w-sm">
                    <AuditLogsSearch />
                </div>

                <Suspense fallback={<TableSkeleton columns={5} rows={5} />}>
                    <AuditLogsTable />
                </Suspense>
            </AuditLogsProvider>
        </div>
    )
}
