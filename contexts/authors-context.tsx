"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition } from "react"
import type { Author } from "@/lib/authors"

interface AuthorsContextType {
    authors: Author[]
    addAuthor: (author: Author) => void
    removeAuthors: (authorIds: string[]) => void
    isPending: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredAuthors: Author[]
    selectedAuthorIds: string[]
    toggleAuthorSelection: (authorId: string) => void
    toggleAllAuthors: (selected: boolean) => void
    clearSelection: () => void
    hasSelection: boolean
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
    const [optimisticAuthors, updateAuthors] = useOptimistic(
        initialAuthors,
        (state, action: { type: "add"; author: Author } | { type: "remove"; authorIds: string[] }) => {
            if (action.type === "add") {
                return [...state, action.author]
            } else if (action.type === "remove") {
                return state.filter((author) => !action.authorIds.includes(author.id))
            }
            return state
        },
    )

    // Estado para pesquisa
    const [searchTerm, setSearchTerm] = useState("")

    // Estado para seleção de autores
    const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([])

    // Use useMemo em vez de useEffect + useState para filtrar autores
    const filteredAuthors = useMemo(() => {
        if (searchTerm === "") {
            return optimisticAuthors
        }

        return optimisticAuthors.filter((author) => author.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [searchTerm, optimisticAuthors])

    const addAuthor = (author: Author) => {
        startTransition(() => {
            updateAuthors({ type: "add", author })
        })
    }

    const removeAuthors = (authorIds: string[]) => {
        startTransition(() => {
            updateAuthors({ type: "remove", authorIds })
            // Limpar seleção após remover
            setSelectedAuthorIds((prev) => prev.filter((id) => !authorIds.includes(id)))
        })
    }

    const toggleAuthorSelection = (authorId: string) => {
        setSelectedAuthorIds((prev) =>
            prev.includes(authorId) ? prev.filter((id) => id !== authorId) : [...prev, authorId],
        )
    }

    const toggleAllAuthors = (selected: boolean) => {
        if (selected) {
            // Selecionar todos os autores filtrados
            setSelectedAuthorIds(filteredAuthors.map((author) => author.id))
        } else {
            // Desmarcar todos
            setSelectedAuthorIds([])
        }
    }

    const clearSelection = () => {
        setSelectedAuthorIds([])
    }

    const hasSelection = selectedAuthorIds.length > 0

    return (
        <AuthorsContext.Provider
            value={{
                authors: optimisticAuthors,
                addAuthor,
                removeAuthors,
                isPending,
                searchTerm,
                setSearchTerm,
                filteredAuthors,
                selectedAuthorIds,
                toggleAuthorSelection,
                toggleAllAuthors,
                clearSelection,
                hasSelection,
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

