"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Trash2, ExternalLink, Pencil, Check, X } from "lucide-react"
import { useBookStatus } from "@/contexts/bookstatus-context"
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
import { deleteBookStatusesAction } from "@/app/book-status/actions"
import { toast } from "react-toastify"
import { Pagination } from "../ui/pagination"
import { BookStatus } from "@/lib/bookstatus"
import { BookStatusModal } from "./book-status-modal"
import { Badge } from "../ui/badge"

export function BookStatusesTable() {
    const {
        paginatedEntities,
        filteredEntities,
        selectedEntityIds,
        toggleEntitySelection,
        toggleAllEntities,
        hasSelection,
        removeEntities,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
    } = useBookStatus()

    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedBookStatus, setSelectedBookStatus] = useState<BookStatus | null>(null)

    // Verificar se todos os book status estão selecionados
    const allSelected =
        paginatedEntities.length > 0 && paginatedEntities.every((bookStatus) => selectedEntityIds.includes(bookStatus.id))

    // Verificar se alguns book status estão selecionados
    const someSelected = selectedEntityIds.length > 0 && !allSelected

    // Função para formatar a data corretamente
    const formatDate = (dateValue: Date | string) => {
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy")
    }

    // Função para excluir as editoras selecionadas
    const handleDeleteSelected = async () => {
        if (selectedEntityIds.length === 0) return

        try {
            setIsDeleting(true)

            // Chamar a Server Action para excluir os book status
            await deleteBookStatusesAction(selectedEntityIds)

            // Atualizar o estado local otimisticamente
            removeEntities(selectedEntityIds)

            const message = selectedEntityIds.length === 1
                ? "Estado excluído com sucesso"
                : `Estados excluídos com sucesso (${selectedEntityIds.length})`;

            toast.success(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

            setIsDialogOpen(false)
        } catch (error) {

            const errorMessage = selectedEntityIds.length === 1
                ? "Erro ao excluir estado"
                : "Erro ao excluir estados";

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

        } finally {
            setIsDeleting(false)
        }
    }

    // Função para abrir o modal de edição
    const handleEditBookStatus = (bookStatus: BookStatus) => {
        setSelectedBookStatus(bookStatus)
        setIsEditModalOpen(true)
    }

    return (
        <div className="space-y-4">
            {hasSelection && (
                <div className="flex justify-end">
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Excluir Selecionados ({selectedEntityIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir status</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir {selectedEntityIds.length} status? Esta ação não pode ser desfeita.
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
                                    onCheckedChange={toggleAllEntities}
                                    aria-label="Selecionar todos os status"
                                />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Data de Criação</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedEntities.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Nenhum status encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedEntities.map((bookStatus) => (
                                <TableRow key={bookStatus.id} className={selectedEntityIds.includes(bookStatus.id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <IndeterminateCheckbox
                                            checked={selectedEntityIds.includes(bookStatus.id)}
                                            onCheckedChange={() => toggleEntitySelection(bookStatus.id)}
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
                                        {bookStatus.isActive ? (
                                            <Badge variant="success" className="flex items-center gap-1 w-fit">
                                                <Check className="h-3 w-3" />
                                                Ativo
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                                <X className="h-3 w-3" />
                                                Inativo
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditBookStatus(bookStatus)}>
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Editar {bookStatus.name}</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/book-status/${bookStatus.slug}`}>
                                                    <ExternalLink className="h-4 w-4" />
                                                    <span className="sr-only">Ver detalhes de {bookStatus.name}</span>
                                                </Link>
                                            </Button>
                                        </div>
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
                totalItems={filteredEntities.length}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                className="mt-4"
            />
            <BookStatusModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} bookStatus={selectedBookStatus} />
        </div>
    )
}

