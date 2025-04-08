"use server"

import { revalidatePath } from "next/cache"
import { deleteReviews, approveReviews, rejectReviews, getReviewById } from "@/lib/reviews"
import { sendReviewApprovalEmail, sendReviewRejectionEmail } from "@/lib/email/review-emails"
import { logAudit } from "@/lib/session"

export async function deleteReviewsAction(reviewIds: string[]) {
    try {
        const deletedCount = await deleteReviews(reviewIds)

        // Revalidate the book page to show updated data
        revalidatePath("/books/[id]")

        return {
            success: true,
            message: `${deletedCount} avaliação(ões) removida(s) com sucesso.`,
            count: deletedCount,
        }
    } catch (error) {
        console.error("Erro ao remover avaliações:", error)
        return {
            success: false,
            message: "Falha ao remover avaliações. Por favor, tente novamente.",
            error: String(error),
        }
    }
}

export async function approveReviewsAction(reviewIds: string[]) {
    try {
        // Primeiro, aprova as reviews na base de dados
        const result = await approveReviews(reviewIds)

        // Criar auditLog
        await logAudit("Review", reviewIds, "APPROVE_REVIEW")

        // Revalida o caminho para atualizar a UI
        revalidatePath("/books/[id]")

        // Envia emails para cada utilizador
        const emailPromises = reviewIds.map(async (id) => {
            const review = await getReviewById(id)
            if (review) {
                return sendReviewApprovalEmail(review)
            }
            return { success: false, error: "Review não encontrada" }
        })

        // Aguarda o envio de todos os emails
        const emailResults = await Promise.allSettled(emailPromises)

        // Conta quantos emails foram enviados com sucesso
        const successfulEmails = emailResults.filter(
            (result) => result.status === "fulfilled" && result.value.success,
        ).length

        return {
            success: true,
            message: `${result} avaliação(ões) aprovada(s) com sucesso. ${successfulEmails} email(s) enviado(s).`,
            count: result,
        }
    } catch (error) {
        console.error("Erro ao aprovar avaliações:", error)
        return {
            success: false,
            message: "Falha ao aprovar avaliações. Por favor, tente novamente.",
            error: String(error),
        }
    }
}

export async function rejectReviewsAction(reviewIds: string[]) {
    try {
        // Primeiro, rejeita as reviews na base de dados
        const result = await rejectReviews(reviewIds)

        // Criar auditLog
        await logAudit("Review", reviewIds, "REJECT_REVIEW")

        // Revalida o caminho para atualizar a UI
        revalidatePath("/books/[id]")

        // Envia emails para cada utilizador
        const emailPromises = reviewIds.map(async (id) => {
            const review = await getReviewById(id)
            if (review) {
                return sendReviewRejectionEmail(review)
            }
            return { success: false, error: "Review não encontrada" }
        })

        // Aguarda o envio de todos os emails
        const emailResults = await Promise.allSettled(emailPromises)

        // Conta quantos emails foram enviados com sucesso
        const successfulEmails = emailResults.filter(
            (result) => result.status === "fulfilled" && result.value.success,
        ).length

        return {
            success: true,
            message: `${result} avaliação(ões) reprovada(s) com sucesso. ${successfulEmails} email(s) enviado(s).`,
            count: result,
        }
    } catch (error) {
        console.error("Erro ao rejeitar avaliações:", error)
        return {
            success: false,
            message: "Falha ao rejeitar avaliações. Por favor, tente novamente.",
            error: String(error),
        }
    }
}