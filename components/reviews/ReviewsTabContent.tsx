"use client"

import { useEffect, useState, useTransition } from "react"
import { format } from "date-fns"
import { Check, Clock, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
import { Pagination } from "@/components/ui/pagination"
import { toast } from "react-toastify"

// Função para formatar a data
const formatDate = (dateValue: Date | string | null) => {
    if (!dateValue) return "-"
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
    return format(date, "dd/MM/yyyy")
}

interface ReviewsTabContentProps {
    bookId?: string
    reviews: Review[]
    isUser?: boolean
}

export function ReviewsTabContent({ bookId, reviews, isUser }: ReviewsTabContentProps) {
    const router = useRouter()
    const [selectedReviews, setSelectedReviews] = useState<string[]>([])
    const [isPending, startTransition] = useTransition()

    // Estados para controlar quais botões mostrar
    const [approvableCount, setApprovableCount] = useState(0)
    const [rejectableCount, setRejectableCount] = useState(0)
    const [hasApproved, setHasApproved] = useState(false)
    const [hasRejected, setHasRejected] = useState(false)

    // Estados para paginação
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [paginatedReviews, setPaginatedReviews] = useState<Review[]>([])
    const totalPages = Math.ceil(reviews.length / pageSize)

    // Atualiza os estados quando as reviews selecionadas mudam
    useEffect(() => {
        updateActionButtonStates()
    }, [selectedReviews])

    // Atualiza as reviews paginadas quando a página ou o número de itens por página muda
    useEffect(() => {
        const startIndex = (currentPage - 1) * pageSize
        const endIndex = startIndex + pageSize
        setPaginatedReviews(reviews.slice(startIndex, endIndex))

        // Limpa as seleções quando a página muda
        setSelectedReviews([])
    }, [currentPage, pageSize, reviews])

    // Função para atualizar os estados dos botões de ação
    const updateActionButtonStates = () => {
        const selectedReviewsData = selectedReviews
            .map((id) => reviews.find((review) => review.id === id))
            .filter(Boolean) as Review[]

        // Conta reviews por estado
        let approvable = 0
        let rejectable = 0
        let approved = false
        let rejected = false

        selectedReviewsData.forEach((review) => {
            // Review pendente (pode ser aprovada ou rejeitada)
            if (review.approvalDate === null) {
                approvable++
                rejectable++
            }
            // Review já aprovada
            else if (review.isAproved) {
                approved = true
            }
            // Review já rejeitada
            else {
                rejected = true
            }
        })

        setApprovableCount(approvable)
        setRejectableCount(rejectable)
        setHasApproved(approved)
        setHasRejected(rejected)
    }

    // Funções para filtrar IDs de reviews por estado
    const getApprovableReviewIds = () => {
        return selectedReviews.filter((id) => {
            const review = reviews.find((r) => r.id === id)
            return review && review.approvalDate === null
        })
    }

    const getRejectableReviewIds = () => {
        return selectedReviews.filter((id) => {
            const review = reviews.find((r) => r.id === id)
            return review && review.approvalDate === null
        })
    }

    const handleRemoveReviews = async () => {
        try {
            const result = await deleteReviewsAction(selectedReviews)

            const message = selectedReviews.length === 1
                ? "Avaliação removida com sucesso"
                : `Avaliações removidas com sucesso (${selectedReviews.length})`

            toast.success(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

            if (result.success) {
                setSelectedReviews([])
                router.refresh()
            } else {
                console.error("Erro ao remover avaliações:", result.message)
            }
        } catch (error) {
            console.error("Erro ao remover avaliações:", error)

            toast.error("Erro ao remover avaliações", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }

    const handleApproveReviews = async () => {
        try {
            // Apenas aprovar reviews que podem ser aprovadas
            const approvableIds = getApprovableReviewIds()
            if (approvableIds.length === 0) return

            const result = await approveReviewsAction(approvableIds)

            const message = approvableIds.length === 1
                ? "Avaliação aprovada com sucesso"
                : `Avaliações aprovadas com sucesso (${approvableIds.length})`

            toast.success(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            })

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

            toast.error("Erro ao aprovar avaliações", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }

    const handleRejectReviews = async () => {
        try {
            // Apenas rejeitar reviews que podem ser rejeitadas
            const rejectableIds = getRejectableReviewIds()
            if (rejectableIds.length === 0) return

            const result = await rejectReviewsAction(rejectableIds)

            const message = rejectableIds.length === 1
                ? "Avaliação reprovada com sucesso"
                : `Avaliações aprovadas com sucesso (${rejectableIds.length})`

            toast.success(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

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

            toast.error("Erro ao reprovar avaliações", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }

    // Função para selecionar/desselecionar todas as reviews da página atual
    const toggleSelectAllCurrentPage = (checked: boolean) => {
        if (checked) {
            const currentPageIds = paginatedReviews.map((review) => review.id)
            setSelectedReviews((prev) => [...prev, ...currentPageIds.filter((id) => !prev.includes(id))])
        } else {
            const currentPageIds = paginatedReviews.map((review) => review.id)
            setSelectedReviews((prev) => prev.filter((id) => !currentPageIds.includes(id)))
        }
    }

    // Verifica se todas as reviews da página atual estão selecionadas
    const areAllCurrentPageSelected =
        paginatedReviews.length > 0 && paginatedReviews.every((review) => selectedReviews.includes(review.id))

    // Handlers para paginação
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePageSizeChange = (size: number) => {
        setPageSize(size)
        setCurrentPage(1) // Reset para a primeira página quando mudar o tamanho
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Avaliações</CardTitle>
                        <CardDescription>
                            {!isUser
                                ? "Avaliações dos utilizadores sobre este livro"
                                : "Todas as avaliações do utilizador"}
                        </CardDescription>

                    </div>
                    {paginatedReviews.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="select-all-reviews"
                                onCheckedChange={toggleSelectAllCurrentPage}
                                checked={areAllCurrentPageSelected}
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

                        {rejectableCount > 0 && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        Rejeitar {rejectableCount > 1 ? `(${rejectableCount})` : ""}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirmar rejeição</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Tem certeza que deseja rejeitar{" "}
                                            {rejectableCount === 1 ? "esta avaliação" : `estas ${rejectableCount} avaliações`}?
                                            {(hasApproved || hasRejected) && (
                                                <p className="mt-2 text-amber-600">Nota: Apenas as avaliações pendentes serão rejeitadas.</p>
                                            )}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleRejectReviews}>Rejeitar</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}

                        {approvableCount > 0 && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        Aprovar {approvableCount > 1 ? `(${approvableCount})` : ""}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirmar aprovação</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Tem certeza que deseja aprovar{" "}
                                            {approvableCount === 1 ? "esta avaliação" : `estas ${approvableCount} avaliações`}?
                                            {(hasApproved || hasRejected) && (
                                                <p className="mt-2 text-amber-600">Nota: Apenas as avaliações pendentes serão aprovadas.</p>
                                            )}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleApproveReviews}>Aprovar</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {paginatedReviews.map((review) => (
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
                                                <div className="text-sm text-muted-foreground">Avaliado em: {formatDate(review.createdAt)}</div>
                                            </div>

                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={`text-lg ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`}
                                                        >
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
            {reviews.length > 0 && (
                <CardFooter className="border-t p-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalItems={reviews.length}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        pageSizeOptions={[5, 10, 20, 50]}
                        className="w-full"
                    />
                </CardFooter>
            )}
        </Card>
    )
}
