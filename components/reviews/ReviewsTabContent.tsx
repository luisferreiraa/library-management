"use client"

import { useState, useTransition } from "react"
import { format } from "date-fns"
import { Check, Clock, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { useRouter } from "next/navigation"
import type { Review } from "@/lib/reviews"
import { approveReviewsAction, deleteReviewsAction, rejectReviewsAction } from "@/app/books/[id]/actions"

// Função para formatar a data
const formatDate = (dateValue: Date | string | null) => {
    if (!dateValue) return "-"
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
    return format(date, "dd/MM/yyyy")
}

interface ReviewsTabContentProps {
    bookId: string
    reviews: Review[]
}

export function ReviewsTabContent({ bookId, reviews }: ReviewsTabContentProps) {
    const router = useRouter()
    const [selectedReviews, setSelectedReviews] = useState<string[]>([])
    const [isPending, startTransition] = useTransition()

    const handleRemoveReviews = async () => {
        try {
            const result = await deleteReviewsAction(selectedReviews)
            if (result.success) {
                setSelectedReviews([])
                router.refresh()
            } else {
                console.error("Erro ao remover avaliações:", result.message)
            }
        } catch (error) {
            console.error("Erro ao remover avaliações:", error)
        }
    }

    const handleApproveReviews = async () => {
        try {
            const result = await approveReviewsAction(selectedReviews)

            if (result.success) {
                setSelectedReviews([])

                // Causa o refresh do componente com transição
                startTransition(() => {
                    router.refresh()
                })
            } else {
                console.error("Erro ao aprovar avaliações:", result.message)
            }
        } catch (error) {
            console.error("Erro ao aprovar avaliações:", error)
        }
    }

    const handleRejectReviews = async () => {
        try {
            const result = await rejectReviewsAction(selectedReviews)

            if (result.success) {
                setSelectedReviews([])

                startTransition(() => {
                    router.refresh()
                })
            } else {
                console.error("Erro ao rejeitar avaliações:", result.message)
            }
        } catch (error) {
            console.error("Erro ao rejeitar avaliações:", error)
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Avaliações</CardTitle>
                        <CardDescription>Avaliações dos utilizadores sobre este livro</CardDescription>
                    </div>
                    {reviews.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="select-all-reviews"
                                onCheckedChange={(checked) => {
                                    const newSelectedReviews = checked ? reviews.map((review) => review.id) : []
                                    setSelectedReviews(newSelectedReviews)
                                }}
                                checked={selectedReviews.length === reviews.length && reviews.length > 0}
                            />
                            <label htmlFor="select-all-reviews" className="text-sm cursor-pointer">
                                Selecionar todas
                            </label>
                        </div>
                    )}
                </div>
                {selectedReviews.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    Remover {selectedReviews.length > 1 ? `(${selectedReviews.length})` : ""}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tem certeza que deseja remover{" "}
                                        {selectedReviews.length === 1 ? "esta avaliação" : `estas ${selectedReviews.length} avaliações`}?
                                        Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleRemoveReviews}>Remover</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    Rejeitar {selectedReviews.length > 1 ? `(${selectedReviews.length})` : ""}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar rejeição</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tem certeza que deseja rejeitar{" "}
                                        {selectedReviews.length === 1 ? "esta avaliação" : `estas ${selectedReviews.length} avaliações`}?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleRejectReviews}>Rejeitar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    Aprovar {selectedReviews.length > 1 ? `(${selectedReviews.length})` : ""}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar aprovação</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tem certeza que deseja aprovar{" "}
                                        {selectedReviews.length === 1 ? "esta avaliação" : `estas ${selectedReviews.length} avaliações`}?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleApproveReviews}>Aprovar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="border rounded-md p-4">
                                <div className="flex justify-between items-start mb-2 gap-4">
                                    {/* Checkbox */}
                                    <div className="pt-1">
                                        <Checkbox
                                            id={`review-${review.id}`}
                                            checked={selectedReviews.includes(review.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedReviews([...selectedReviews, review.id])
                                                } else {
                                                    setSelectedReviews(selectedReviews.filter((id) => id !== review.id))
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Conteúdo da review */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-medium">
                                                    {review.user.firstName} {review.user.lastName}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Avaliado em: {formatDate(review.createdAt)}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <span key={i} className={`text-lg ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`}>
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>

                                                {review.approvalDate === null ? (
                                                    <Badge variant="outline_pending" className="flex items-center gap-1 w-fit">
                                                        <Clock className="h-3 w-3" />
                                                        Por aprovar
                                                    </Badge>
                                                ) : review.isAproved ? (
                                                    <Badge variant="outline_success" className="flex items-center gap-1 w-fit">
                                                        <Check className="h-3 w-3" />
                                                        Aprovado
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline_destructive" className="flex items-center gap-1 w-fit">
                                                        <X className="h-3 w-3" />
                                                        Reprovado
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-sm mt-2">{review.comment}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-muted-foreground">Nenhuma avaliação para este livro.</div>
                )}
            </CardContent>
        </Card>
    )
}

