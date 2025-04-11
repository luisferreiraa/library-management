"use client"

import { format } from "date-fns"
import { Trash2, X, Check } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { markMultipleBooksAsReturnedAction } from "@/app/borrowed-books/actions"
import { toast } from "react-toastify"
import { useBorrowedBooks } from "@/contexts/borrowed-books-context"
import { Pagination } from "../ui/pagination"

// Definir colunas que podem ser exibidas
export type BorrowedBooksColumn = "barcode" | "user" | "borrowedAt" | "dueDate" | "returnDate" | "fine" | "status"

interface BorrowedBooksTableProps {
    // Definir quais as colunas para incluir
    columns?: BorrowedBooksColumn[]
    // Mostrar checkboxes e ações?
    showSelection?: boolean
    // Mostrar paginação?
    showPagination?: boolean
    // Título opcional para a tabela
    title?: string
}

export function BorrowedBooksTable({
    columns = ["barcode", "user", "borrowedAt", "dueDate", "returnDate", "fine", "status"],
    showSelection = true,
    showPagination = true,
    title,
}: BorrowedBooksTableProps) {
    const {
        paginatedBorrowedBooks,
        filteredBorrowedBooks,
        selectedBorrowedBookIds,
        toggleBorrowedBookSelection,
        toggleAllBorrowedBooks,
        hasSelection,
        markAsReturned,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
    } = useBorrowedBooks()

    const [isMarking, setIsMarking] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Verificar se todos os borrowedBooks estão selecionados
    const allSelected =
        paginatedBorrowedBooks.length > 0 &&
        paginatedBorrowedBooks.every((borrowedBook) => selectedBorrowedBookIds.includes(borrowedBook.id))

    // Verificar se alguns borrowedBooks estão selecionados
    const someSelected = selectedBorrowedBookIds.length > 0 && !allSelected

    // Função para formatar a data corretamente
    const formatDate = (dateValue: Date | string) => {
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy")
    }

    // Função para marcar os borrowedBooks como devolvidos selecionados
    const handleMarkSelected = async () => {
        if (selectedBorrowedBookIds.length === 0) return

        try {
            setIsMarking(true)

            // Chamar a Server Action para marcar os borrowedBooks
            await markMultipleBooksAsReturnedAction(selectedBorrowedBookIds)

            // Atualizar o estado local otimisticamente
            markAsReturned(selectedBorrowedBookIds)

            const message = selectedBorrowedBookIds.length === 1
                ? "Devolução registada com sucesso"
                : `Devoluções registadas com sucesso (${selectedBorrowedBookIds.length})`;

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

            const errorMessage = selectedBorrowedBookIds.length === 1
                ? "Erro ao devolver livro"
                : "Erro ao devolver livros";

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

        } finally {
            setIsMarking(false)
        }
    }

    return (
        <div className="space-y-4">
            {title && <h3 className="text-lg font-medium">{title}</h3>}

            {showSelection && hasSelection && (
                <div className="flex justify-end">
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Devolver Selecionados ({selectedBorrowedBookIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Marcar como devolvidos</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja marcar {selectedBorrowedBookIds.length} livro(s) como devolvido(s)? Esta ação
                                    não pode ser desfeita.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isMarking}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleMarkSelected}
                                    disabled={isMarking}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isMarking ? "A devolver..." : "Devolvidos"}
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
                            {showSelection && (
                                <TableHead className="w-[50px]">
                                    <IndeterminateCheckbox
                                        checked={allSelected}
                                        indeterminate={someSelected}
                                        onCheckedChange={toggleAllBorrowedBooks}
                                        aria-label="Selecionar todos os empréstimos"
                                    />
                                </TableHead>
                            )}
                            {columns.includes("barcode") && <TableHead>Código de Barras</TableHead>}
                            {columns.includes("user") && <TableHead>Utilizador</TableHead>}
                            {columns.includes("borrowedAt") && <TableHead>Data de Empréstimo</TableHead>}
                            {columns.includes("dueDate") && <TableHead>Prazo p/ Devolução</TableHead>}
                            {columns.includes("returnDate") && <TableHead>Data de Devolução</TableHead>}
                            {columns.includes("fine") && <TableHead>Multa</TableHead>}
                            {columns.includes("status") && <TableHead>Estado</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedBorrowedBooks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={showSelection ? columns.length + 1 : columns.length} className="h-24 text-center">
                                    Nenhum empréstimo encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedBorrowedBooks.map((borrowedBook) => (
                                <TableRow
                                    key={borrowedBook.id}
                                    className={showSelection && selectedBorrowedBookIds.includes(borrowedBook.id) ? "bg-muted/50" : ""}
                                >
                                    {showSelection && (
                                        <TableCell>
                                            <IndeterminateCheckbox
                                                checked={selectedBorrowedBookIds.includes(borrowedBook.id)}
                                                onCheckedChange={() => toggleBorrowedBookSelection(borrowedBook.id)}
                                                aria-label={`Selecionar ${borrowedBook.id}`}
                                            />
                                        </TableCell>
                                    )}
                                    {columns.includes("barcode") && (
                                        <TableCell className="font-medium">
                                            {borrowedBook.barcode ? borrowedBook.barcode.code : "Código não disponível"}
                                        </TableCell>
                                    )}
                                    {columns.includes("user") && (
                                        <TableCell>
                                            {borrowedBook.user
                                                ? `${borrowedBook.user.firstName} ${borrowedBook.user.lastName}`
                                                : "Utilizador não disponível"}
                                        </TableCell>
                                    )}
                                    {columns.includes("borrowedAt") && (
                                        <TableCell>{borrowedBook.borrowedAt ? formatDate(borrowedBook.borrowedAt) : "-"}</TableCell>
                                    )}
                                    {columns.includes("dueDate") && (
                                        <TableCell>{borrowedBook.dueDate ? formatDate(borrowedBook.dueDate) : "-"}</TableCell>
                                    )}
                                    {columns.includes("returnDate") && (
                                        <TableCell>{borrowedBook.returnDate ? formatDate(borrowedBook.returnDate) : "-"}</TableCell>
                                    )}
                                    {columns.includes("fine") && (
                                        <TableCell>{borrowedBook.isActive ? "-" : `${borrowedBook.fineValue || 0} €`}</TableCell>
                                    )}
                                    {columns.includes("status") && (
                                        <TableCell>
                                            {borrowedBook.isActive ? (
                                                <Badge variant="pending" className="flex items-center gap-1 w-fit">
                                                    <X className="h-3 w-3" />A decorrer
                                                </Badge>
                                            ) : (
                                                <Badge variant="success" className="flex items-center gap-1 w-fit">
                                                    <Check className="h-3 w-3" />
                                                    Devolvido
                                                </Badge>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {showPagination && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredBorrowedBooks.length}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    className="mt-4"
                />
            )}
        </div>
    )
}

