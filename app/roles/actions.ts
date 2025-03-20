"use server"

import { revalidatePath } from "next/cache"
import { createRole, deleteRoles } from "@/lib/roles"
import { logAudit } from "@/lib/session";

export async function createRoleAction(roleData: { name: string }): Promise<any> {
    try {
        // Criar o role na base de dados
        const newRole = await createRole(roleData)

        // Criar auditLog
        await logAudit("Role", newRole.id, "CREATE_ROLE");

        // Revalidar o caminho para atualizar dados
        revalidatePath("/roles")

        return newRole
    } catch (error: any) {
        throw new Error("Erro ao criar role: " + error.message)
    }
}

export async function deleteRolesAction(roleIds: string[]): Promise<void> {
    try {
        // Excluir os roles da base de dados
        await deleteRoles(roleIds)

        // Criar auditLog
        await logAudit("Role", roleIds, "DELETE_ROLE");

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/roles")
    } catch (error: any) {
        throw new Error("Erro ao excluir role: " + error.message)
    }
}