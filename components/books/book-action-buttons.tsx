"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { CreateBookModal } from "./create-book-modal"
import { BooksProvider } from "@/contexts/books-context"
import type { BookWithRelations } from "@/lib/books"
import { updateBookIsActiveAction } from "@/app/books/actions"
import { toast } from "react-toastify"

interface BookActionButtonsProps {
    book: BookWithRelations
}

export function BookActionButtons({ book }: BookActionButtonsProps) {
    const router = useRouter()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [currentBookStatus, setCurrentBookStatus] = useState(book.isActive)

    // Função para alternar o status do livro
    const toggleBookActiveStatus = async () => {
        try {
            setIsLoading(true)

            // Chamar a server action para atualizar o status
            const newStatus = !currentBookStatus
            await updateBookIsActiveAction(book.id, newStatus)

            // Atualizar o estado local para refletir a mudança
            setCurrentBookStatus(newStatus)

            // Mostrar mensagem de sucesso
            toast.success(newStatus ? "Livro ativado com sucesso" : "Livro desativado com sucesso", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

            // Forçar uma revalidação completa da página
            setTimeout(() => {
                router.refresh()
            }, 100)
        } catch (error) {
            console.error("Erro ao atualizar status:", error)

            toast.error("Erro ao atualizar o status do livro", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Função para abrir o modal de edição
    const handleEditBook = () => {
        setIsEditModalOpen(true)
    }

    return (
        <BooksProvider initialBooks={[]}>
            <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full" onClick={handleEditBook}>
                    Editar Livro
                </Button>
                {currentBookStatus ? (
                    <Button variant="destructive" className="w-full" onClick={toggleBookActiveStatus} disabled={isLoading}>
                        {isLoading ? "A processar..." : "Desativar Livro"}
                    </Button>
                ) : (
                    <Button variant="default" className="w-full" onClick={toggleBookActiveStatus} disabled={isLoading}>
                        {isLoading ? "A processar..." : "Ativar Livro"}
                    </Button>
                )}
            </div>

            {/* Modal de edição */}
            <CreateBookModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                book={book}
                mode="edit"
                onSuccess={() => {
                    // Forçar uma revalidação completa da página após edição
                    setTimeout(() => {
                        router.refresh()
                    }, 100)
                }}
            />
        </BooksProvider>
    )
}