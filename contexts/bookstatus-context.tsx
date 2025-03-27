"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition, useEffect } from "react"
import type { BookStatus } from "@/lib/bookstatus"

// Definir SortOption type
export type SortOption = {
    value: string
    direction: "asc" | "desc"
}

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
    currentPage: number
    setCurrentPage: (page: number) => void
    pageSize: number
    setPageSize: (size: number) => void
    paginatedBookStatuses: BookStatus[]
    totalPages: number
    sortOption: SortOption | null
    setSortOption: (option: SortOption) => void
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

    // Estado para paginação
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Estado para ordenação
    const [sortOption, setSortOption] = useState<SortOption | null>(null)

    // useMemo é utilizado para evitar recalcular a lista filtrada sempre que o componente renderiza
    // garantindo melhor performance
    const filteredBookStatuses = useMemo(() => {
        // Criamos uma cópia da lista de autores para evitar modificar o estado original
        let result = [...optimisticBookStatuses]

        // Se houver um termo de pesquisa, filtramos os autores pelo nome ou biografia
        if (searchTerm !== "") {
            const lowerSearchTerm = searchTerm.toLowerCase()
            result = result.filter(
                (bookStatus) =>
                    bookStatus.name.toLowerCase().includes(lowerSearchTerm)
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
    }, [searchTerm, optimisticBookStatuses, sortOption])     // Dependências: recalcula apenas quando uma delas mudar

    // Calcular total de páginas
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredBookStatuses.length / pageSize))
    }, [filteredBookStatuses, pageSize])

    // Ajustar a página atual se necessário
    useMemo(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(1, totalPages))
        }
    }, [totalPages, currentPage])

    // Resetar para a primeira página quando o sorting altera
    useEffect(() => {
        setCurrentPage(1)
    }, [sortOption])

    // Obter os status paginados
    const paginatedBookStatuses = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return filteredBookStatuses.slice(startIndex, startIndex + pageSize)
    }, [filteredBookStatuses, currentPage, pageSize])

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
                currentPage,
                setCurrentPage,
                pageSize,
                setPageSize,
                paginatedBookStatuses,
                totalPages,
                sortOption,
                setSortOption,
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
