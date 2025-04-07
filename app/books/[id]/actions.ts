"use server"

import { revalidatePath } from "next/cache"
import { deleteReviews, approveReviews, rejectReviews } from "@/lib/reviews"

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
        const updatedCount = await approveReviews(reviewIds)

        // Revalidate the book page to show updated data
        revalidatePath("/books/[id]")

        return {
            success: true,
            message: `${updatedCount} avaliação(ões) aprovada(s) com sucesso.`,
            count: updatedCount,
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
        const updatedCount = await rejectReviews(reviewIds)

        revalidatePath("/books/[id]")

        return {
            success: true,
            message: `${updatedCount} avaliação(ões) reprovada(s) com sucesso.`,
            count: updatedCount,
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