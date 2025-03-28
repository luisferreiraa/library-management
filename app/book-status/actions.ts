"use server"

import { revalidatePath } from "next/cache"
import { createBookStatus, deleteBookStatuses, updateBookStatus } from "@/lib/bookstatus"
import { logAudit } from "@/lib/session"

export async function createBookStatusAction(bookStatusData: { name: string }): Promise<any> {
    try {
        // Criar o bookStatus na base de dados
        const newBookStatus = await createBookStatus(bookStatusData)

        // Criar auditLog
        await logAudit("Book Status", newBookStatus.id, "CREATE_BOOK_STATUS")

        // Revalidar o caminho para atualizar dados
        revalidatePath("/bookstatus")

        return newBookStatus
    } catch (error: any) {
        throw new Error("Erro ao criar book status: " + error.message)
    }
}

export async function updateBookStatusAction(bookStatusData: {
    id: string
    name: string
}): Promise<any> {
    try {
        // Atualizar o book status na base de dados
        const updatedBookStatus = await updateBookStatus(bookStatusData.id, {
            name: bookStatusData.name,
        })

        // Criar auditLog
        await logAudit("Book Status", bookStatusData.id, "UPDATE_BOOK_STATUS")

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/book-status")
        revalidatePath(`/book-status/${bookStatusData.id}`)

        return updatedBookStatus
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Erro ao atualizar book status (ID: ${bookStatusData.id}): ${error.message}`);
        }
        throw new Error("Erro desconhecido ao atualizar book status.");
    }
}

export async function deleteBookStatusesAction(bookStatusIds: string[]): Promise<void> {
    try {
        // Excluir os book status da base de dados
        await deleteBookStatuses(bookStatusIds)

        // Criar auditLog
        await logAudit("Book Status", bookStatusIds, "DELETE_BOOK_STATUS")

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/bookstatus")
    } catch (error: any) {
        throw new Error("Erro ao excluir book status: " + error.message)
    }
}