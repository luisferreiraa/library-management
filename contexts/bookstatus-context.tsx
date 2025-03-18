"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition } from "react"
import type { BookStatus } from "@/lib/bookstatus"

interface BookStatusesContextType {
    bookStatuses: BookStatus[]
    addBookStatus: (bookstatus: BookStatus) => void
    removeBookStatuses: (bookStatusIds: string[]) => void
    isPending: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredBookStatuses: BookStatus[]
    selectedBookStatusIds: string[]
    toggleBookStatusSelection: (bookStatusId: string) => void
    toggleAllBookStatuses: (selected: boolean) => void
    clearSelection: () => void
    hasSelection: boolean
}

const BookStatusesContext = createContext<BookStatusesContextType | undefined>(undefined)

export function BookStatusesProvider({
    children,
    initialBookStatuses,
}: {
    children: ReactNode
    initialBookStatuses: BookStatus[]
}) {
    const [isPending, startTransition] = useTransition()
    const [optimisticBookStatuses, updateBookStatuses] = useOptimistic(
        initialBookStatuses,
        (state, action: { type: "add"; bookStatus: BookStatus } | { type: "remove"; bookStatusIds: string[] }) => {
            if (action.type === "add") {
                return [...state, action.bookStatus]
            } else if (action.type === "remove") {
                return state.filter((bookStatus) => !action.bookStatusIds.includes(bookStatus.id))
            }
            return state
        },
    )

    // Estado para pesquisa
    const [searchTerm, setSearchTerm] = useState("")

    // Estado para seleção de book status
    const [selectedBookStatusIds, setSelectedBookStatusIds] = useState<string[]>([])

    // Usar useMemo em vez de useEffect + useState para filtrar book status
    const filteredBookStatuses = useMemo(() => {
        if (searchTerm === "") {
            return optimisticBookStatuses
        }

        return optimisticBookStatuses.filter((bookStatus) => bookStatus.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [searchTerm, optimisticBookStatuses])

    const addBookStatus = (bookStatus: BookStatus) => {
        startTransition(() => {
            updateBookStatuses({ type: "add", bookStatus })
        })
    }

    const removeBookStatuses = (bookStatusIds: string[]) => {
        startTransition(() => {
            updateBookStatuses({ type: "remove", bookStatusIds })
            // Limpar seleção após remover
            setSelectedBookStatusIds((prev) => prev.filter((id) => !bookStatusIds.includes(id)))
        })
    }

    const toggleBookStatusSelection = (bookStatusId: string) => {
        setSelectedBookStatusIds((prev) =>
            prev.includes(bookStatusId) ? prev.filter((id) => id !== bookStatusId) : [...prev, bookStatusId],
        )
    }

    const toggleAllBookStatuses = (selected: boolean) => {
        if (selected) {
            // Selecionar todas os book status filtradas
            setSelectedBookStatusIds(filteredBookStatuses.map((bookStatus) => bookStatus.id))
        } else {
            // Desmarcar todas
            setSelectedBookStatusIds([])
        }
    }

    const clearSelection = () => {
        setSelectedBookStatusIds([])
    }

    const hasSelection = selectedBookStatusIds.length > 0

    return (
        <BookStatusesContext.Provider
            value={{
                bookStatuses: optimisticBookStatuses,
                addBookStatus,
                removeBookStatuses,
                isPending,
                searchTerm,
                setSearchTerm,
                filteredBookStatuses,
                selectedBookStatusIds,
                toggleBookStatusSelection,
                toggleAllBookStatuses,
                clearSelection,
                hasSelection,
            }}
        >
            {children}
        </BookStatusesContext.Provider>
    )
}

export function useBookStatuses() {
    const context = useContext(BookStatusesContext)
    if (context === undefined) {
        throw new Error("useBookStatuses must be used within a BookStatusesProvider")
    }
    return context
}
