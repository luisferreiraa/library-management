"use client"

import { createContext, useContext, type ReactNode, useOptimistic, useTransition } from "react"
import type { Author } from "@/lib/authors"

interface AuthorsContextType {
    authors: Author[]
    addAuthor: (author: Author) => void
    isPending: boolean
}

const AuthorsContext = createContext<AuthorsContextType | undefined>(undefined)

export function AuthorsProvider({
    children,
    initialAuthors,
}: {
    children: ReactNode
    initialAuthors: Author[]
}) {
    const [isPending, startTransition] = useTransition()
    const [optimisticAuthors, addOptimisticAuthor] = useOptimistic(initialAuthors, (state, newAuthor: Author) => [
        ...state,
        newAuthor,
    ])

    const addAuthor = (author: Author) => {
        startTransition(() => {
            addOptimisticAuthor(author)
        })
    }

    return (
        <AuthorsContext.Provider
            value={{
                authors: optimisticAuthors,
                addAuthor,
                isPending,
            }}
        >
            {children}
        </AuthorsContext.Provider>
    )
}

export function useAuthors() {
    const context = useContext(AuthorsContext)
    if (context === undefined) {
        throw new Error("useAuthors must be used within an AuthorsProvider")
    }
    return context
}

