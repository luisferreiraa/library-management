"use server"

import { revalidatePath } from "next/cache"
import { createPublisher, deletePublishers } from "@/lib/publishers"
import { logAudit } from "@/lib/session";

export async function createPublisherAction(publisherData: { name: string }): Promise<any> {
    try {
        // Criar a editora na base de dados
        const newPublisher = await createPublisher(publisherData)

        // Criar auditLog
        await logAudit("Publisher", newPublisher.id, "CREATE_PUBLISHER");

        // Revalidar o caminho para atualizar dados
        revalidatePath("/publishers")

        return newPublisher
    } catch (error: any) {
        throw new Error("Erro ao criar publisher: " + error.message)
    }
}

export async function deletePublishersAction(publisherIds: string[]): Promise<void> {
    try {
        // Excluir as editoras da base de dados
        await deletePublishers(publisherIds)

        // Criar auditLog
        await logAudit("Publisher", publisherIds, "DELETE_PUBLISHER");

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/publishers")
    } catch (error: any) {
        throw new Error("Erro ao excluir editoras: " + error.message)
    }
}