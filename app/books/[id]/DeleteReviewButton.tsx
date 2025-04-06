'use client'

import { Button } from "@/components/ui/button"
import { deleteReviewByIdAction } from "./actions"
import { Trash2 } from "lucide-react"

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
            <Trash2 className="h-3 w-3" />
        </Button>
    )
}