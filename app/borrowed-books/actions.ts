"use server"

import { revalidatePath } from "next/cache";
import { createBorrowedBook, getBorrowedBookById, markBookAsReturned, markMultipleBooksAsReturned } from "@/lib/borrowed-books";
import { logAudit } from "@/lib/session";
import { getBarcodeIdByCode } from "@/lib/barcodes";
import { sendBorrowedBookEmail, sendReturnedBorrowedBookEmail } from "@/lib/email/borrowed-book-emails";

export async function createBorrowedBookAction(borrowedBookData: { code: string, userId: string }): Promise<any> {
    try {
        const { code, userId } = borrowedBookData;

        // Obter barcodeId a partir do código
        const barcode = await getBarcodeIdByCode(code);
        if (!barcode) {
            throw new Error("Código de livro não encontrado.");
        }

        // Criar borrowedBook na base de dados
        const newBorrowedBook = await createBorrowedBook(barcode.id, userId);

        // Criar auditLog
        await logAudit("BorrowedBook", newBorrowedBook.id, "CREATE_BORROWED_BOOK");

        // Revalidar o caminho para atualizar dados
        revalidatePath("/borrowed-books");

        const borrowedBook = await getBorrowedBookById(newBorrowedBook.id)


        if (borrowedBook) {
            const result = await sendBorrowedBookEmail(borrowedBook)
            if (!result.success) {
                console.error(`Erro ao enviar email para o utilizador:`, result.error)
            }
        } else {
            console.error("Empréstimo não encontrado ao tentar enviar email.")
        }

        return newBorrowedBook;
    } catch (error: any) {
        throw new Error("Erro ao criar empréstimo: " + error.message);
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

        // Obter os dados do empréstimo com as relações necessárias
        const borrowedBook = await getBorrowedBookById(borrowedBookId)
        if (borrowedBook) {
            const result = await sendReturnedBorrowedBookEmail(borrowedBook)
            if (!result.success) {
                console.error(`Erro ao enviar email para o utilizador:`, result.error)
            }
        } else {
            console.error("Empréstimo não encontrado ao tentar enviar email.")
        }

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

        // Envia emails para cada utilizador
        const emailPromises = borrowedBookIds.map(async (id) => {
            const borrowedBook = await getBorrowedBookById(id)
            if (borrowedBook) {
                return sendReturnedBorrowedBookEmail(borrowedBook)
            }
            return { success: false, error: "Empréstimo não encontrado" }
        })

        // Aguarda o envio de todos os emails
        const emailResults = await Promise.allSettled(emailPromises)

        emailResults.forEach((result, index) => {
            if (result.status === "rejected") {
                console.error(`Erro ao enviar email para o empréstimo ${borrowedBookIds[index]}:`, result.reason)
            }
        })

    } catch (error: any) {
        throw new Error("Erro ao marcar como devolvido: " + error.message)
    }
}