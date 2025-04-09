"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition, useEffect } from "react"
import type { Author } from "@/lib/authors"

// Definir SortOption type
export type SortOption = {
    value: string
    direction: "asc" | "desc"
}

// Definir FilterOption type para isActive
export type ActiveFilterOption = "all" | "active" | "inactive"

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
    currentPage: number
    setCurrentPage: (page: number) => void
    pageSize: number
    setPageSize: (size: number) => void
    paginatedAuthors: Author[]
    totalPages: number
    sortOption: SortOption | null
    setSortOption: (option: SortOption) => void
    activeFilter: ActiveFilterOption
    setActiveFilter: (filter: ActiveFilterOption) => void
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

    // Estado para paginação
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Estado para ordenação
    const [sortOption, setSortOption] = useState<SortOption | null>(null)

    // Estado para filtro de isActive
    const [activeFilter, setActiveFilter] = useState<ActiveFilterOption>("all")

    // useMemo é utilizado para evitar recalcular a lista filtrada sempre que o componente renderiza
    // garantindo melhor performance
    const filteredAuthors = useMemo(() => {
        // Criamos uma cópia da lista de autores para evitar modificar o estado original
        let result = [...optimisticAuthors]

        // Aplicar filtro por isActive
        if (activeFilter != "all") {
            const isActive = activeFilter === "active"
            result = result.filter((author) => author.isActive === isActive)
        }

        // Se houver um termo de pesquisa, filtramos os autores pelo nome ou biografia
        if (searchTerm !== "") {
            const lowerSearchTerm = searchTerm.toLowerCase()
            result = result.filter(
                (author) =>
                    author.name.toLowerCase().includes(lowerSearchTerm) ||
                    author.bio?.toLocaleLowerCase().includes(lowerSearchTerm),
            )
        }

        // Se houver uma opção de ordenação selecionada, aplicamos a ordenação
        if (sortOption) {
            result.sort((a, b) => {
                let valueA: any, valueB: any

                switch (sortOption.value) {
                    case "name":
                        // Ordenação pelo nome (string)
                        valueA = a.name
                        valueB = b.name
                        break
                    case "createdAt":
                        // Ordenação pela data de criação (convertida para timestamp para comparação numérica)
                        valueA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                        valueB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                        break
                    default:
                        // Ordenação padrão pelo nome caso a opção não seja reconhecida
                        valueA = a.name
                        valueB = b.name
                        break
                }

                // Se os valores forem strings, usamos localCompare para garantir ordenação alfabética correta
                if (typeof valueA === "string" && typeof valueB === "string") {
                    return sortOption.direction === "asc"
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA)
                }

                // Caso contrário, ordenamos numericamente (ex: datas convertidas em timestamps)
                return sortOption.direction === "asc"
                    ? (valueA || 0) - (valueB || 0)
                    : (valueB || 0) - (valueA || 0)
            })
        }

        // Retornamos a lista filtrada e ordenada
        return result
    }, [searchTerm, optimisticAuthors, sortOption, activeFilter])     // Dependências: recalcula apenas quando uma delas mudar

    // Calcular total de páginas
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredAuthors.length / pageSize))
    }, [filteredAuthors, pageSize])

    // Ajustar página atual se necessário
    useMemo(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(1, totalPages))
        }
    }, [totalPages, currentPage])

    // Obter autores paginados
    const paginatedAuthors = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return filteredAuthors.slice(startIndex, startIndex + pageSize)
    }, [filteredAuthors, currentPage, pageSize])

    // Resetar para a primeira página quando o sorting altera
    useEffect(() => {
        setCurrentPage(1)
    }, [sortOption, activeFilter])

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
                currentPage,
                setCurrentPage,
                pageSize,
                setPageSize,
                paginatedAuthors,
                totalPages,
                sortOption,
                setSortOption,
                activeFilter,
                setActiveFilter,
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

