"use client"

import { createContext, useContext, type ReactNode, useOptimistic, useTransition } from "react"
import type { BookStatus } from "@/lib/bookstatus"

interface BookStatusesContextType {
    bookStatuses: BookStatus[]
    addBookStatus: (bookstatus: BookStatus) => void
    isPending: boolean
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
    const [optimisticBookStatuses, addOptimisticBookStatus] = useOptimistic(initialBookStatuses, (state, newBookStatus: BookStatus) => [
        ...state,
        newBookStatus,
    ])

    const addBookStatus = (bookStatus: BookStatus) => {
        startTransition(() => {
            addOptimisticBookStatus(bookStatus)
        })
    }

    return (
        <BookStatusesContext.Provider
            value={{
                bookStatuses: optimisticBookStatuses,
                addBookStatus,
                isPending
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
