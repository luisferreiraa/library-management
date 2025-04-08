"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition, useEffect } from "react"
import type { BorrowedBookWithRelations } from "@/lib/borrowed-books"

// Definir SortOption type
export type SortOption = {
    value: string
    direction: "asc" | "desc"
}

// Definir FilterOption type para isActive
export type ActiveFilterOption = "all" | "active" | "inactive"

interface BorrowedBooksContextType {
    borrowedBooks: BorrowedBookWithRelations[]
    addBorrowedBook: (borrowedBook: BorrowedBookWithRelations) => void
    markAsReturned: (borrowedBookIds: string[]) => void
    isPending: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredBorrowedBooks: BorrowedBookWithRelations[]
    selectedBorrowedBookIds: string[]
    toggleBorrowedBookSelection: (borrowedBookId: string) => void
    toggleAllBorrowedBooks: (selected: boolean) => void
    clearSelection: () => void
    hasSelection: boolean
    currentPage: number
    setCurrentPage: (page: number) => void
    pageSize: number
    setPageSize: (size: number) => void
    paginatedBorrowedBooks: BorrowedBookWithRelations[]
    totalPages: number
    sortOption: SortOption | null
    setSortOption: (option: SortOption) => void
    activeFilter: ActiveFilterOption
    setActiveFilter: (filter: ActiveFilterOption) => void
}

const BorrowedBooksContext = createContext<BorrowedBooksContextType | undefined>(undefined)

export function BorrowedBooksProvider({
    children,
    initialBorrowedBooks,
}: {
    children: ReactNode
    initialBorrowedBooks: BorrowedBookWithRelations[]
}) {
    const [isPending, startTransition] = useTransition()
    const [optimisticBorrowedBooks, updateBorrowedBooks] = useOptimistic(
        initialBorrowedBooks,
        (state, action: { type: "add"; borrowedBook: BorrowedBookWithRelations } | { type: "update"; borrowedBookIds: string[] }) => {
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

    // Estado para paginação
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Estado para ordenação
    const [sortOption, setSortOption] = useState<SortOption | null>(null)

    // Estado para filtro de isActive
    const [activeFilter, setActiveFilter] = useState<ActiveFilterOption>("all")

    // useMemo é utilizado para evitar recalcular a lista filtrada sempre que o componente renderiza
    // garantindo melhor performance
    const filteredBorrowedBooks = useMemo(() => {
        // Criamos uma cópia da lista de autores para evitar modificar o estado original
        let result = [...optimisticBorrowedBooks]

        // Aplicar filtro por isActive
        if (activeFilter != "all") {
            const isActive = activeFilter === "active"
            result = result.filter((borrowedbook) => borrowedbook.isActive === isActive)
        }

        // Se houver um termo de pesquisa, filtramos os autores pelo nome ou biografia
        if (searchTerm !== "") {
            const lowerSearchTerm = searchTerm.toLowerCase()
            result = result.filter(
                (borrowedBook) =>
                    borrowedBook.id.toLowerCase().includes(lowerSearchTerm)
            )
        }

        // Se houver uma opção de ordenação selecionada, aplicamos a ordenação
        if (sortOption) {
            result.sort((a, b) => {
                let valueA: any, valueB: any

                switch (sortOption.value) {
                    case "id":
                        // Ordenação pelo id (string)
                        valueA = a.id
                        valueB = b.id
                        break
                    case "borrowedAt":
                        // Ordenação pela data de empréstimo (convertida para timestamp para comparação numérica)
                        valueA = a.borrowedAt ? new Date(a.borrowedAt).getTime() : 0
                        valueB = b.borrowedAt ? new Date(b.borrowedAt).getTime() : 0
                        break
                    case "dueDate":
                        // Ordenação pelo prazo de devolução (convertida para timestamp para comparação numérica)
                        valueA = a.dueDate ? new Date(a.dueDate).getTime() : 0
                        valueB = b.dueDate ? new Date(b.dueDate).getTime() : 0
                        break
                    case "returnDate":
                        // Ordenação pela data de devolução (convertida para timestamp para comparação numérica)
                        valueA = a.returnDate ? new Date(a.returnDate).getTime() : 0
                        valueB = b.returnDate ? new Date(b.returnDate).getTime() : 0
                        break
                    case "fineValue":
                        // Ordenação pelo valor da multa
                        valueA = a.id
                        valueB = b.id
                        break
                    default:
                        // Ordenação padrão pelo nome caso a opção não seja reconhecida
                        valueA = a.id
                        valueB = b.id
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
    }, [searchTerm, optimisticBorrowedBooks, sortOption, activeFilter])     // Dependências: recalcula apenas quando uma delas mudar

    // Calcular total de páginas
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredBorrowedBooks.length / pageSize))
    }, [filteredBorrowedBooks, pageSize])

    // Ajustar página atual se necessário
    useMemo(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(1, totalPages))
        }
    }, [totalPages, currentPage])

    // Obter borrowedBooks paginados
    const paginatedBorrowedBooks = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return filteredBorrowedBooks.slice(startIndex, startIndex + pageSize)
    }, [filteredBorrowedBooks, currentPage, pageSize])

    // Resetar para a primeira página quando o sorting altera
    useEffect(() => {
        setCurrentPage(1)
    }, [sortOption, activeFilter])

    const addBorrowedBook = (borrowedBook: BorrowedBookWithRelations) => {
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
                currentPage,
                setCurrentPage,
                pageSize,
                setPageSize,
                paginatedBorrowedBooks,
                totalPages,
                sortOption,
                setSortOption,
                activeFilter,
                setActiveFilter,
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

