"use server"

import { revalidatePath } from "next/cache"
import { createLibraryNetwork, deleteLibraryNetworks, updateLibraryNetwork } from "@/lib/library-networks"
import { logAudit } from "@/lib/session";

export async function createLibraryNetworkAction(libraryNetworkData: { name: string, isActive: boolean }): Promise<any> {
    try {

        const newLibraryNetwork = await createLibraryNetwork(libraryNetworkData)

        // Criar auditLog
        await logAudit("Library Network", newLibraryNetwork.id, "CREATE_LIBRARY_NETWORK");

        // Revalidar o caminho para atualizar dados
        revalidatePath("/library-networks")

        return newLibraryNetwork
    } catch (error: any) {
        throw new Error("Erro ao criar library network: " + error.message)
    }
}

export async function updateLibraryNetworkAction(libraryNetworkData: {
    id: string
    name: string
    isActive: boolean
}): Promise<any> {
    try {
        // Atualizar na base de dados
        const updatedLibraryNetwork = await updateLibraryNetwork(libraryNetworkData.id, {
            name: libraryNetworkData.name,
            isActive: libraryNetworkData.isActive
        })

        // Criar auditLog
        await logAudit("Library Network", libraryNetworkData.id, "UPDATE_LIBRARY_NETWORK")

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/library-network")
        revalidatePath(`/library-network/${libraryNetworkData.id}`)

        return updatedLibraryNetwork
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Erro ao atualizar library network (ID: ${libraryNetworkData.id}): ${error.message}`);
        }
        throw new Error("Erro desconhecido ao atualizar library network.")
    }
}

export async function deleteLibraryNetworksAction(libraryNetworkIds: string[]): Promise<void> {
    try {

        await deleteLibraryNetworks(libraryNetworkIds)

        // Criar auditLog
        await logAudit("Library Network", libraryNetworkIds, "DELETE_LIBRARY_NETWORK");

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/library-network")
    } catch (error: any) {
        throw new Error("Erro ao excluir library network: " + error.message)
    }
}