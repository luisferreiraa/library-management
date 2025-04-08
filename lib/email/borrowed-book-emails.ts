import { sendEmail } from "./email-service"
import { getBorrowedBookEmailTemplate, getReturnBorrowedBookEmailTemplate } from "./templates"
import type { BorrowedBookWithRelations } from "../borrowed-books"
import { getBookById } from "../books"
import { getUserById } from "../users"

export async function sendReturnedBorrowedBookEmail(borrowedBook: BorrowedBookWithRelations) {
    try {
        // Obter informações do livro e utilizador para incluir no email
        const book = await getBookById(borrowedBook.barcode.bookId)
        const user = await getUserById(borrowedBook.userId)

        if (!book) {
            console.error(`Livro não encontrado para o empréstimo com ID: ${borrowedBook.id}`)
            return { success: false, error: "Livro não encontrado" }
        }

        // Verificar se o utilizador tem email
        if (!user?.email) {
            console.error(`Utilizador sem email para o empréstimo com ID: ${borrowedBook.id}`)
            return { success: false, error: "Utilizador sem email" }
        }

        const emailHtml = getReturnBorrowedBookEmailTemplate(borrowedBook, book, user)

        return await sendEmail({
            to: user?.email,
            subject: "A devolução foi confirmada",
            html: emailHtml,
        })
    } catch (error) {
        console.error("Erro ao enviar email de confirmação de devolução:", error)
        return { success: false, error }
    }
}

export async function sendBorrowedBookEmail(borrowedBook: BorrowedBookWithRelations) {
    try {
        // Obter informações do livro e utilizador para incluir no email
        const book = await getBookById(borrowedBook.barcode.bookId)
        const user = await getUserById(borrowedBook.userId)

        if (!book) {
            console.error(`Livro não encontrado para o empréstimo com ID: ${borrowedBook.id}`)
            return { success: false, error: "Livro não encontrado" }
        }

        // Verificar se o utilizador tem email
        if (!user?.email) {
            console.error(`Utilizador sem email para o empréstimo com ID: ${borrowedBook.id}`)
            return { success: false, error: "Utilizador sem email" }
        }

        const emailHtml = getBorrowedBookEmailTemplate(borrowedBook, book, user)

        return await sendEmail({
            to: user?.email,
            subject: "O empréstimo foi confirmado",
            html: emailHtml,
        })
    } catch (error) {
        console.error("Erro ao enviar email de confirmação de empréstimo:", error)
        return { success: false, error }
    }
}