"use server"

import { deleteReviewById } from "@/lib/books"
import { revalidatePath } from "next/cache"

export async function deleteReviewByIdAction(reviewId: string): Promise<void> {
    try {
        await deleteReviewById(reviewId)
        revalidatePath("/books/[id]")
    } catch (error: any) {
        throw new Error("Erro ao excluir a avaliação: " + error.message)
    }
}