"use server"

import { revalidatePath } from "next/cache"
import { createBookStatus } from "@/lib/bookstatus"

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