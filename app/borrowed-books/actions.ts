"use server"

import { revalidatePath } from "next/cache";
import { createBorrowedBook, markBookAsReturned, markMultipleBooksAsReturned } from "@/lib/borrowed-books";
import { logAudit } from "@/lib/session";

export async function createBorrowedBookAction(borrowedBookData: { barcodeId: string, userId: string }): Promise<any> {
    try {
        const { barcodeId, userId } = borrowedBookData


        // Criar borrowedBook na base de dados
        const newBorrowedBook = await createBorrowedBook(barcodeId, userId)

        // Criar auditLog
        await logAudit("BorrowedBook", newBorrowedBook.id, "CREATE_BORROWED_BOOK");

        // Revalidar o caminho para atualizar dados
        revalidatePath("/borrowed-books")

        return newBorrowedBook
    } catch (error: any) {
        throw new Error("Erro ao criar empréstimo: " + error.message)
    }
}

export async function markBookAsReturnedAction(borrowedBookId: string): Promise<void> {
    try {
        // Marcar o empréstimo como terminado na base de dados
        await markBookAsReturned(borrowedBookId)

        // Criar auditLog
        await logAudit("BorrowedBook", borrowedBookId, "MARK_AS_RETURNED");

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/borrowed-books")
    } catch (error: any) {
        throw new Error("Erro ao marcar como devolvido: " + error.message)
    }
}

export async function markMultipleBooksAsReturnedAction(borrowedBookIds: string[]): Promise<void> {
    try {
        // Marcar o empréstimo como terminado na base de dados
        await markMultipleBooksAsReturned(borrowedBookIds)

        // Criar auditLog
        await logAudit("BorrowedBook", borrowedBookIds, "MARK_AS_RETURNED");

        // Revalidar o caminho para atualizar os dados
        revalidatePath("/borrowed-books")
    } catch (error: any) {
        throw new Error("Erro ao marcar como devolvido: " + error.message)
    }
}