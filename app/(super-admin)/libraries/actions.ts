"use server"

import { createLibrary, deleteLibraries, updateLibrary } from "@/lib/libraries"
import { logAudit } from "@/lib/session"
import { revalidatePath } from "next/cache"

export async function createLibraryAction(libraryData: {
    name: string,
    location: string,
    libraryNetworkId: string,
    isActive: boolean
}): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        const newLibrary = await createLibrary(libraryData)
        await logAudit("Library", newLibrary.id, "CREATE_LIBRARY")
        revalidatePath("/libraries")
        return { success: true, data: newLibrary }
    } catch (error: any) {
        return {
            success: false,
            error: "Erro ao criar biblioteca: " + error.message
        }
    }
}

export async function updateLibraryAction(libraryData: {
    id: string,
    name: string,
    location: string,
    libraryNetworkId: string,
    isActive: boolean
}): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        const updatedLibrary = await updateLibrary(
            libraryData.id,
            {
                name: libraryData.name,
                location: libraryData.location,
                libraryNetworkId: libraryData.libraryNetworkId,
                isActive: libraryData.isActive
            }
        )

        await logAudit("Library", libraryData.id, "UPDATE_LIBRARY")
        revalidatePath("/libraries")
        revalidatePath(`/libraries/${libraryData.id}`)
        return { success: true, data: updatedLibrary }
    } catch (error: any) {
        return {
            success: false,
            error: `Erro ao atualizar biblioteca: ${error.message}`
        }
    }
}

export async function deleteLibrariesAction(libraryIds: string[]): Promise<void> {
    try {

        await deleteLibraries(libraryIds)

        // Criar auditLog
        await logAudit("Library", libraryIds, "DELETE_LIBRARY");

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/libraries")
    } catch (error: any) {
        throw new Error("Erro ao excluir library: " + error.message)
    }
}
