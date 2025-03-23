"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Trash2, ExternalLink, X, Check } from "lucide-react"
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
import { toast } from "@/components/ui/use-toast"
import { useBorrowedBooks } from "@/contexts/borrowed-books-context"

export function BorrowedBooksTable() {
    const { filteredBorrowedBooks, selectedBorrowedBookIds, toggleBorrowedBookSelection, toggleAllBorrowedBooks, hasSelection, markAsReturned } =
        useBorrowedBooks()

    const [isMarking, setIsMarking] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Verificar se todos os borrowedBooks estão selecionados
    const allSelected =
        filteredBorrowedBooks.length > 0 && filteredBorrowedBooks.every((borrowedBook) => selectedBorrowedBookIds.includes(borrowedBook.id))

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

            toast({
                title: "Livros devolvidos com sucesso",
                description: `${selectedBorrowedBookIds.length} livro(s) foram devolvidos.`,
            })

            setIsDialogOpen(false)
        } catch (error) {
            toast({
                title: "Erro ao devolver livros",
                description: "Ocorreu um erro ao devolver os livros selecionados.",
                variant: "destructive",
            })
        } finally {
            setIsMarking(false)
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
                                Devolver Selecionados ({selectedBorrowedBookIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Marcar como devolvidos</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja marcar {selectedBorrowedBookIds.length} livro(s) como devolvido(s)? Esta ação não pode ser desfeita.
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
                            <TableHead className="w-[50px]">
                                <IndeterminateCheckbox
                                    checked={allSelected}
                                    indeterminate={someSelected}
                                    onCheckedChange={toggleAllBorrowedBooks}
                                    aria-label="Selecionar todos os empréstimos"
                                />
                            </TableHead>
                            <TableHead>Código de Barras</TableHead>
                            <TableHead>Utilizador</TableHead>
                            <TableHead>Data de Empréstimo</TableHead>
                            <TableHead>Prazo p/ Devolução</TableHead>
                            <TableHead>Data de Devolução</TableHead>
                            <TableHead>Multa</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBorrowedBooks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Nenhum empréstimo encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBorrowedBooks.map((borrowedBook) => (
                                <TableRow key={borrowedBook.id} className={selectedBorrowedBookIds.includes(borrowedBook.id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <IndeterminateCheckbox
                                            checked={selectedBorrowedBookIds.includes(borrowedBook.id)}
                                            onCheckedChange={() => toggleBorrowedBookSelection(borrowedBook.id)}
                                            aria-label={`Selecionar ${borrowedBook.id}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{borrowedBook.barcode.code}</TableCell>
                                    <TableCell>{`${borrowedBook.user.firstName} ${borrowedBook.user.lastName}`}</TableCell>
                                    <TableCell>{formatDate(borrowedBook.borrowedAt)}</TableCell>
                                    <TableCell>{formatDate(borrowedBook.dueDate)}</TableCell>
                                    <TableCell>
                                        {borrowedBook.returnDate ? new Date(borrowedBook.returnDate).toLocaleDateString() : "-"}
                                    </TableCell>

                                    <TableCell>{borrowedBook.isActive ? "-" : `${borrowedBook.fineValue} €`}</TableCell>
                                    <TableCell>
                                        {borrowedBook.isActive ? (
                                            <Badge variant="pending" className="flex items-center gap-1 w-fit">
                                                <X className="h-3 w-3" />
                                                Ativo
                                            </Badge>
                                        ) : (
                                            <Badge variant="success" className="flex items-center gap-1 w-fit">
                                                <Check className="h-3 w-3" />
                                                Entregue
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

