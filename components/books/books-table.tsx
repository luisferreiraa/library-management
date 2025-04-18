"use client"

import { format } from "date-fns"
import Link from "next/link"
import Image from "next/image"
import { Trash2, ExternalLink, BookIcon, Check, X, Pencil } from "lucide-react"
import { useBooks } from "@/contexts/books-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IndeterminateCheckbox } from "@/components/ui/indetermined-checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { deleteBooksAction } from "@/app/books/actions"
import { toast } from "react-toastify"
import { Pagination } from "../ui/pagination"
import { CreateBookModal } from "./create-book-modal"

import type { Book, BookWithRelations } from "@/lib/books"

export function BooksTable() {
    const {
        paginatedBooks,
        filteredBooks,
        selectedBookIds,
        toggleBookSelection,
        toggleAllBooks,
        hasSelection,
        removeBooks,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
    } = useBooks()

    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedBook, setSelectedBook] = useState<BookWithRelations | null>(null)

    // Verificar se todos os livros estão selecionados
    const allSelected = paginatedBooks.length > 0 && paginatedBooks.every((book) => selectedBookIds.includes(book.id))

    // Verificar se alguns livros estão selecionados
    const someSelected = selectedBookIds.length > 0 && !allSelected

    // Função para formatar a data corretamente
    const formatDate = (dateValue: Date | string | null) => {
        if (!dateValue) return "-"
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
        return format(date, "dd/MM/yyyy")
    }

    // Função para excluir os livros selecionados
    const handleDeleteSelected = async () => {
        if (selectedBookIds.length === 0) return

        try {
            setIsDeleting(true)

            // Chamar a Server Action para excluir os livros
            await deleteBooksAction(selectedBookIds)

            // Atualizar o estado local otimisticamente
            removeBooks(selectedBookIds)

            const message = selectedBookIds.length === 1
                ? "Livro excluído com sucesso"
                : `Livros excluídos com sucesso (${selectedBookIds.length})`;

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

            const errorMessage = selectedBookIds.length === 1
                ? "Erro ao excluir livro"
                : "Erro ao excluir livros";

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
    const handleEditBook = (book: BookWithRelations) => {
        setSelectedBook(book)
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
                                Excluir Selecionados ({selectedBookIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir livros</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir {selectedBookIds.length} livro(s)? Esta ação não pode ser desfeita.
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
                                    onCheckedChange={toggleAllBooks}
                                    aria-label="Selecionar todos os livros"
                                />
                            </TableHead>
                            <TableHead className="w-[80px]">Capa</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>ISBN</TableHead>
                            <TableHead>Autor</TableHead>
                            <TableHead>Editora</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[80px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedBooks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    Nenhum livro encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedBooks.map((book) => (
                                <TableRow key={book.id} className={selectedBookIds.includes(book.id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <IndeterminateCheckbox
                                            checked={selectedBookIds.includes(book.id)}
                                            onCheckedChange={() => toggleBookSelection(book.id)}
                                            aria-label={`Selecionar ${book.title}`}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {book.coverImage ? (
                                            <div className="relative h-12 w-10 overflow-hidden rounded-sm">
                                                <Image
                                                    src={book.coverImage || "/placeholder.svg"}
                                                    alt={book.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex h-12 w-10 items-center justify-center rounded-sm bg-muted">
                                                <BookIcon className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <Link href={`/books/${book.id}`} className="hover:underline hover:text-primary transition-colors">
                                            {book.title}
                                        </Link>
                                        <div className="text-xs text-muted-foreground">
                                            {book.edition}ª Edição • {book.pageCount} páginas
                                        </div>
                                    </TableCell>
                                    <TableCell>{book.isbn}</TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/authors/${book.authorId}`}
                                            className="hover:underline hover:text-primary transition-colors"
                                        >
                                            {book.author.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/publishers/${book.publisher.slug}`}
                                            className="hover:underline hover:text-primary transition-colors"
                                        >
                                            {book.publisher.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {book.isActive ? (
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
                                            <Button variant="ghost" size="icon" onClick={() => handleEditBook(book)}>
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Editar {book.title}</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/books/${book.id}`}>
                                                    <ExternalLink className="h-4 w-4" />
                                                    <span className="sr-only">Ver detalhes de {book.title}</span>
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
                totalItems={filteredBooks.length}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                className="mt-4"
            />

            {/* Modal de edição de livro */}
            <CreateBookModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} book={selectedBook} mode="edit" />
        </div>
    )
}

