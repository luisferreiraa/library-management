"use server"

import { revalidatePath } from "next/cache"
import { createFormat, deleteFormats, updateFormat } from "@/lib/formats"
import { logAudit } from "@/lib/session";

export async function createFormatAction(formatData: { name: string, isActive: boolean }): Promise<any> {
    try {
        // Criar o formato na base de dados
        const newFormat = await createFormat(formatData)

        // Criar auditLog
        await logAudit("Format", newFormat.id, "CREATE_FORMAT");

        // Revalidar o caminho para atualizar dados
        revalidatePath("/formats")

        return newFormat
    } catch (error: any) {
        throw new Error("Erro ao criar formato: " + error.message)
    }
}

export async function updateFormatAction(formatData: {
    id: string
    name: string
    isActive: boolean
}): Promise<any> {
    try {
        // Atualizar o formato na base de dados
        const updatedFormat = await updateFormat(formatData.id, {
            name: formatData.name,
            isActive: formatData.isActive
        })

        // Criar auditLog
        await logAudit("Format", formatData.id, "UPDATE_FORMAT")

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/formats")
        revalidatePath(`/formats/${formatData.id}`)

        return updatedFormat
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Erro ao atualizar formato (ID: ${formatData.id}): ${error.message}`)
        }
        throw new Error("Erro desconhecido ao atualizar formato.")
    }
}

export async function deleteFormatsAction(formatIds: string[]): Promise<void> {
    try {
        // Excluir os formatos da base de dados
        await deleteFormats(formatIds)

        // Criar auditLog
        await logAudit("Format", formatIds, "DELETE_FORMAT");

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/formats")
    } catch (error: any) {
        throw new Error("Erro ao excluir formatos: " + error.message)
    }
}