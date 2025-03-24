"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Trash2, ExternalLink } from "lucide-react"
import { useBookStatuses } from "@/contexts/bookstatus-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IndeterminateCheckbox } from "@/components/ui/indetermined-checkbox"
import { Button } from "@/components/ui/button"
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
import { useState } from "react"
import { deleteBookStatusesAction } from "@/app/bookstatus/actions"
import { toast } from "@/components/ui/use-toast"
import { Pagination } from "../ui/pagination"

export function BookStatusesTable() {
    const {
        paginatedBookStatuses,
        filteredBookStatuses,
        selectedBookStatusIds,
        toggleBookStatusSelection,
        toggleAllBookStatuses,
        hasSelection,
        removeBookStatuses,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
    } = useBookStatuses()

    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Verificar se todos os book status estão selecionados
    const allSelected =
        paginatedBookStatuses.length > 0 && paginatedBookStatuses.every((bookStatus) => selectedBookStatusIds.includes(bookStatus.id))

    // Verificar se alguns book status estão selecionados
    const someSelected = selectedBookStatusIds.length > 0 && !allSelected

    // Função para formatar a data corretamente
    const formatDate = (dateValue: Date | string) => {
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy")
    }

    // Função para excluir as editoras selecionadas
    const handleDeleteSelected = async () => {
        if (selectedBookStatusIds.length === 0) return

        try {
            setIsDeleting(true)

            // Chamar a Server Action para excluir os book status
            await deleteBookStatusesAction(selectedBookStatusIds)

            // Atualizar o estado local otimisticamente
            removeBookStatuses(selectedBookStatusIds)

            toast({
                title: "Status excluídos com sucesso",
                description: `${selectedBookStatusIds.length} status foram excluídos.`,
            })

            setIsDialogOpen(false)
        } catch (error) {
            toast({
                title: "Erro ao excluir status",
                description: "Ocorreu um erro ao exluir os status selecionados",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="space-y-4">
            {hasSelection && (
                <div className="flex justify-end">
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Excluir Selecionados ({selectedBookStatusIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir status</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir {selectedBookStatusIds.length} status? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteSelected}
                                    disabled={isDeleting}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isDeleting ? "Excluindo..." : "Excluir"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}

            <div className="w-full mx-auto rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <IndeterminateCheckbox
                                    checked={allSelected}
                                    indeterminate={someSelected}
                                    onCheckedChange={toggleAllBookStatuses}
                                    aria-label="Selecionar todos os status"
                                />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Data de Criação</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedBookStatuses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Nenhum status encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedBookStatuses.map((bookStatus) => (
                                <TableRow key={bookStatus.id} className={selectedBookStatusIds.includes(bookStatus.id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <IndeterminateCheckbox
                                            checked={selectedBookStatusIds.includes(bookStatus.id)}
                                            onCheckedChange={() => toggleBookStatusSelection(bookStatus.id)}
                                            aria-label={`Selecionar ${bookStatus.name}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {/* Transformar o nome do status num link */}
                                        <Link
                                            href={`/bookstatus/${bookStatus.slug}`}
                                            className="hover:underline hover:text-primary transition-colors"
                                        >
                                            {bookStatus.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{format(new Date(bookStatus.createdAt), "dd/MM/yyyy")}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/bookstatus/${bookStatus.slug}`}>
                                                <ExternalLink className="h-4 w-4" />
                                                <span className="sr-only">Ver detalhes de {bookStatus.name}</span>
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredBookStatuses.length}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                className="mt-4"
            />
        </div>
    )
}

