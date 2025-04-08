import { sendEmail } from "./email-service"
import { getApprovalEmailTemplate, getRejectionEmailTemplate } from "@/lib/email/templates"
import type { Review } from "@/lib/reviews"
import { getBookById } from "@/lib/books"
import { getUserById } from "../users"

export async function sendReviewApprovalEmail(review: Review) {
    try {
        // Obter informações do livro e utilizador para incluir no email
        const book = await getBookById(review.bookId)
        const user = await getUserById(review.userId)

        if (!book) {
            console.error(`Livro não encontrado para a review ID: ${review.id}`)
            return { success: false, error: "Livro não encontrado" }
        }

        // Verificar se o utilizador tem email
        if (!user?.email) {
            console.error(`Utilizador sem email para a review ID: ${review.id}`)
            return { success: false, error: "Utilizador sem email" }
        }

        const emailHtml = getApprovalEmailTemplate(review, book, user)

        return await sendEmail({
            to: user?.email,
            subject: "A sua avaliação foi aprovada!",
            html: emailHtml,
        })
    } catch (error) {
        console.error("Erro ao enviar email de aprovação:", error)
        return { success: false, error }
    }
}

export async function sendReviewRejectionEmail(review: Review) {
    try {
        // Obter informações do livro e utilizador para incluir no email
        const book = await getBookById(review.bookId)
        const user = await getUserById(review.userId)

        if (!book) {
            console.error(`Livro não encontrado para a review ID: ${review.id}`)
            return { success: false, error: "Livro não encontrado" }
        }

        // Verificar se o utilizador tem email
        if (!user?.email) {
            console.error(`Utilizador sem email para a review ID: ${review.id}`)
            return { success: false, error: "Utilizador sem email" }
        }

        const emailHtml = getRejectionEmailTemplate(review, book, user)

        return await sendEmail({
            to: user?.email,
            subject: "Atualização sobre a sua avaliação",
            html: emailHtml,
        })
    } catch (error) {
        console.error("Erro ao enviar email de rejeição:", error)
        return { success: false, error }
    }
}