"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition } from "react"
import type { BookWithRelations } from "@/lib/books"

interface BooksContextType {
    books: BookWithRelations[]
    addBook: (book: BookWithRelations) => void
    removeBooks: (bookIds: string[]) => void
    isPending: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredBooks: BookWithRelations[]
    selectedBookIds: string[]
    toggleBookSelection: (bookId: string) => void
    toggleAllBooks: (selected: boolean) => void
    clearSelection: () => void
    hasSelection: boolean
    currentPage: number
    setCurrentPage: (page: number) => void
    pageSize: number
    setPageSize: (size: number) => void
    paginatedBooks: BookWithRelations[]
    totalPages: number
}

const BooksContext = createContext<BooksContextType | undefined>(undefined)

export function BooksProvider({
    children,
    initialBooks,
}: {
    children: ReactNode
    initialBooks: BookWithRelations[]
}) {
    const [isPending, startTransition] = useTransition()
    const [optimisticBooks, updateBooks] = useOptimistic(
        initialBooks,
        (state, action: { type: "add"; book: BookWithRelations } | { type: "remove"; bookIds: string[] }) => {
            if (action.type === "add") {
                return [...state, action.book]
            } else if (action.type === "remove") {
                return state.filter((book) => !action.bookIds.includes(book.id))
            }
            return state
        },
    )

    // Estado para pesquisa
    const [searchTerm, setSearchTerm] = useState("")

    // Estado para seleção de livros
    const [selectedBookIds, setSelectedBookIds] = useState<string[]>([])

    // Estado para paginação
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Use useMemo para filtrar livros
    const filteredBooks = useMemo(() => {
        if (searchTerm === "") {
            return optimisticBooks
        }

        const lowerSearchTerm = searchTerm.toLowerCase()
        return optimisticBooks.filter(
            (book) =>
                book.title.toLowerCase().includes(lowerSearchTerm) ||
                book.isbn.toLowerCase().includes(lowerSearchTerm) ||
                book.author.name.toLowerCase().includes(lowerSearchTerm) ||
                book.publisher.name.toLowerCase().includes(lowerSearchTerm),
        )
    }, [searchTerm, optimisticBooks])

    // Calcular total de páginas
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredBooks.length / pageSize))
    }, [filteredBooks, pageSize])

    // Ajustar página atual se necessário
    useMemo(() => {
        if (currentPage > pageSize) {
            setCurrentPage(Math.max(1, totalPages))
        }
    }, [totalPages, currentPage])

    // Obter livros paginados
    const paginatedBooks = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return filteredBooks.slice(startIndex, startIndex + pageSize)
    }, [filteredBooks, currentPage, pageSize])


    const addBook = (book: BookWithRelations) => {
        startTransition(() => {
            updateBooks({ type: "add", book })
        })
    }

    const removeBooks = (bookIds: string[]) => {
        startTransition(() => {
            updateBooks({ type: "remove", bookIds })
            // Limpar seleção após remover
            setSelectedBookIds((prev) => prev.filter((id) => !bookIds.includes(id)))
        })
    }

    const toggleBookSelection = (bookId: string) => {
        setSelectedBookIds((prev) => (prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]))
    }

    const toggleAllBooks = (selected: boolean) => {
        if (selected) {
            // Selecionar todos os livros filtrados
            setSelectedBookIds(filteredBooks.map((book) => book.id))
        } else {
            // Desmarcar todos
            setSelectedBookIds([])
        }
    }

    const clearSelection = () => {
        setSelectedBookIds([])
    }

    const hasSelection = selectedBookIds.length > 0

    return (
        <BooksContext.Provider
            value={{
                books: optimisticBooks,
                addBook,
                removeBooks,
                isPending,
                searchTerm,
                setSearchTerm,
                filteredBooks,
                selectedBookIds,
                toggleBookSelection,
                toggleAllBooks,
                clearSelection,
                hasSelection,
                currentPage,
                setCurrentPage,
                pageSize,
                setPageSize,
                paginatedBooks,
                totalPages,
            }}
        >
            {children}
        </BooksContext.Provider>
    )
}

export function useBooks() {
    const context = useContext(BooksContext)
    if (context === undefined) {
        throw new Error("useBooks must be used within a BooksProvider")
    }
    return context
}

