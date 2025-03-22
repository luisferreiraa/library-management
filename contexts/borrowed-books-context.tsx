"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition } from "react"
import type { BorrowedBook } from "@/lib/borrowed-books"

interface BorrowedBooksContextType {
    borrowedBooks: BorrowedBook[]
    addBorrowedBook: (borrowedBook: BorrowedBook) => void
    markAsReturned: (borrowedBookIds: string[]) => void
    isPending: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredBorrowedBooks: BorrowedBook[]
    selectedBorrowedBookIds: string[]
    toggleBorrowedBookSelection: (borrowedBookId: string) => void
    toggleAllBorrowedBooks: (selected: boolean) => void
    clearSelection: () => void
    hasSelection: boolean
}

const BorrowedBooksContext = createContext<BorrowedBooksContextType | undefined>(undefined)

export function BorrowedBooksProvider({
    children,
    initialBorrowedBooks,
}: {
    children: ReactNode
    initialBorrowedBooks: BorrowedBook[]
}) {
    const [isPending, startTransition] = useTransition()
    const [optimisticBorrowedBooks, updateBorrowedBooks] = useOptimistic(
        initialBorrowedBooks,
        (state, action: { type: "add"; borrowedBook: BorrowedBook } | { type: "update"; borrowedBookIds: string[] }) => {
            if (action.type === "add") {
                return [...state, action.borrowedBook]
            } else if (action.type === "update") {
                return state.filter((borrowedBook) => !action.borrowedBookIds.includes(borrowedBook.id))
            }
            return state
        },
    )

    // Estado para pesquisa
    const [searchTerm, setSearchTerm] = useState("")

    // Estado para seleção de borrowedBooks
    const [selectedBorrowedBookIds, setSelectedBorrowedBookIds] = useState<string[]>([])

    // Use useMemo em vez de useEffect + useState para filtrar borrowedBooks
    const filteredBorrowedBooks = useMemo(() => {
        if (searchTerm === "") {
            return optimisticBorrowedBooks
        }

        return optimisticBorrowedBooks.filter((borrowedBook) => borrowedBook.id.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [searchTerm, optimisticBorrowedBooks])

    const addBorrowedBook = (borrowedBook: BorrowedBook) => {
        startTransition(() => {
            updateBorrowedBooks({ type: "add", borrowedBook })
        })
    }

    const markAsReturned = (borrowedBookIds: string[]) => {
        startTransition(() => {
            updateBorrowedBooks({ type: "update", borrowedBookIds })
            // Limpar seleção após remover
            setSelectedBorrowedBookIds((prev) => prev.filter((id) => !borrowedBookIds.includes(id)))
        })
    }

    const toggleBorrowedBookSelection = (borrowedBookId: string) => {
        setSelectedBorrowedBookIds((prev) =>
            prev.includes(borrowedBookId) ? prev.filter((id) => id !== borrowedBookId) : [...prev, borrowedBookId],
        )
    }

    const toggleAllBorrowedBooks = (selected: boolean) => {
        if (selected) {
            // Selecionar todos os borrowedBooks filtrados
            setSelectedBorrowedBookIds(filteredBorrowedBooks.map((borrowedBook) => borrowedBook.id))
        } else {
            // Desmarcar todos
            setSelectedBorrowedBookIds([])
        }
    }

    const clearSelection = () => {
        setSelectedBorrowedBookIds([])
    }

    const hasSelection = selectedBorrowedBookIds.length > 0

    return (
        <BorrowedBooksContext.Provider
            value={{
                borrowedBooks: optimisticBorrowedBooks,
                addBorrowedBook,
                markAsReturned,
                isPending,
                searchTerm,
                setSearchTerm,
                filteredBorrowedBooks,
                selectedBorrowedBookIds,
                toggleBorrowedBookSelection,
                toggleAllBorrowedBooks,
                clearSelection,
                hasSelection,
            }}
        >
            {children}
        </BorrowedBooksContext.Provider>
    )
}

export function useBorrowedBooks() {
    const context = useContext(BorrowedBooksContext)
    if (context === undefined) {
        throw new Error("useBorrowedBooks must be used within an BorrowedBooksProvider")
    }
    return context
}

