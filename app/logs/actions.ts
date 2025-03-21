"use server"

import { revalidatePath } from "next/cache"
import { deleteAuditLogs } from "@/lib/auditlogs"

export async function deleteAuditLogsAction(auditLogIds: string[]): Promise<void> {
    try {
        await deleteAuditLogs(auditLogIds)

        revalidatePath("/logs")
    } catch (error: any) {
        throw new Error("Erro ao excluir logs " + error.message)
    }
}