'use client'

import { Button } from "@/components/ui/button"
import { deleteReviewByIdAction } from "./actions"

interface Props {
    reviewId: string
}

export function DeleteReviewButton({ reviewId }: Props) {
    const handleDelete = async () => {
        try {
            await deleteReviewByIdAction(reviewId)
        } catch (error) {
            console.error("Erro ao excluir:", error)
        }
    }

    return (
        <Button variant="destructive" size="sm" onClick={handleDelete}>
            Eliminar
        </Button>
    )
}