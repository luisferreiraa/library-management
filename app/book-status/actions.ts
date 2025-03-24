"use server"

import { revalidatePath } from "next/cache"
import { createBookStatus, deleteBookStatuses } from "@/lib/bookstatus"

export async function createBookStatusAction(bookStatusData: { name: string }): Promise<any> {
    try {
        // Criar o bookStatus na base de dados
        const newBookStatus = await createBookStatus(bookStatusData)

        // Revalidar o caminho para atualizar dados
        revalidatePath("/bookstatus")

        return newBookStatus
    } catch (error: any) {
        throw new Error("Erro ao criar book status: " + error.message)
    }
}

export async function deleteBookStatusesAction(bookStatusIds: string[]): Promise<void> {
    try {
        // Excluir os book status da base de dados
        await deleteBookStatuses(bookStatusIds)

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/bookstatus")
    } catch (error: any) {
        throw new Error("Erro ao excluir book status: " + error.message)
    }
}