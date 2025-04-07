"use client"

import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { deleteReviewsAction } from "@/app/books/[id]/actions"

interface DeleteReviewButtonProps {
    reviewId: string
}

export function DeleteReviewButton({ reviewId }: DeleteReviewButtonProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const handleDeleteReview = async () => {
        try {
            const result = await deleteReviewsAction([reviewId])
            if (result.success) {
                router.refresh()
                setOpen(false)
            } else {
                console.error("Erro ao remover avaliação:", result.message)
                // Aqui você poderia adicionar uma notificação de erro para o usuário
            }
        } catch (error) {
            console.error("Erro ao remover avaliação:", error)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    Remover
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja remover esta avaliação? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteReview}>Remover</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

