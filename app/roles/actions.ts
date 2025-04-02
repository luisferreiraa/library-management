"use server"

import { revalidatePath } from "next/cache"
import { createRole, deleteRoles, updateRole } from "@/lib/roles"
import { logAudit } from "@/lib/session";

export async function createRoleAction(roleData: { name: string, isActive: boolean }): Promise<any> {
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

export async function updateRoleAction(roleData: {
    id: string
    name: string
    isActive: boolean
}): Promise<any> {
    try {
        // Atualizar na base de dados
        const updatedRole = await updateRole(roleData.id, {
            name: roleData.name,
            isActive: roleData.isActive
        })

        // Criar auditLog
        await logAudit("Role", roleData.id, "UPDATE_ROLE")

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/roles")
        revalidatePath(`/roles/${roleData.id}`)

        return updatedRole
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Erro ao atualizar role (ID: ${roleData.id}): ${error.message}`);
        }
        throw new Error("Erro desconhecido ao atualizar role.")
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