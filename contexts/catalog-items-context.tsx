"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition, useEffect } from "react"
import type { CatalogItem } from "@prisma/client"
import { SortOption } from "@/types/types"

// Definir SortOptions type
/* export type SortOption = {
    value: string
    direction: "asc" | "desc"
} */

// Definir FilterOption type para isActive
export type ActiveFilterOption = "all" | "BOOK" | "PERIODICAL" | "DVD" | "VHS" | "CD"

interface CatalogItemsContextType {
    items: CatalogItem[]
    isPending: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredItems: CatalogItem[]
    selectedItemIds: string[]
    toggleItemSelection: (itemId: string) => void
    toggleAllItems: (selected: boolean) => void
    clearSelection: () => void
    hasSelection: boolean
    currentPage: number
    setCurrentPage: (page: number) => void
    pageSize: number
    setPageSize: (size: number) => void
    paginatedItems: CatalogItem[]
    totalPages: number
    sortOption: SortOption<CatalogItem> | null
    setSortOption: (option: SortOption<CatalogItem>) => void
    activeFilter: ActiveFilterOption
    setActiveFilter: (filter: ActiveFilterOption) => void
}

const CatalogItemsContext = createContext<CatalogItemsContextType | undefined>(undefined)

export function ItemsProvider({
    children,
    initialItems,
}: {
    children: ReactNode
    initialItems: CatalogItem[]
}) {
    const [isPending, startTransition] = useTransition()

    // Estado para pesquisa
    const [searchTerm, setSearchTerm] = useState("")

    // Estado para seleção de livros
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])

    // Estado para paginação
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Estado para ordenação
    const [sortOption, setSortOption] = useState<SortOption<CatalogItem> | null>(null)

    // Estado para filtro de isActive
    const [activeFilter, setActiveFilter] = useState<ActiveFilterOption>("all")

    // Use useMemo para filtrar e ordenar livros
    const filteredItems = useMemo(() => {
        // Primeiro, filtramos os livros
        let result = [...initialItems]

        // Aplicar filtro por isActive
        if (activeFilter != "all") {
            activeFilter === "BOOK"
            result = result.filter((item) => item.type === activeFilter)
        }

        if (searchTerm !== "") {
            const lowerSearchTerm = searchTerm.toLowerCase()
            result = result.filter(
                (item) =>
                    item.title.toLowerCase().includes(lowerSearchTerm) ||
                    item.subTitle.toLowerCase().includes(lowerSearchTerm),
            )
        }

        // Ordenamos os filtered books se uma opção de ordenação estiver selecionada
        if (sortOption) {
            result.sort((a, b) => {
                let valueA: any, valueB: any

                // Manipular propriedades específicas de forma segura quanto ao tipo
                switch (sortOption.value) {
                    case "title":
                        valueA = a.title
                        valueB = b.title
                        break
                    case "subTitle":
                        valueA = a.subTitle
                        valueB = b.subTitle
                        break
                    case "createdAt":
                        valueA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                        valueB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                        break
                    default:
                        // Título padrão se a opção de ordenação não for reconhecida
                        valueA = a.title
                        valueB = b.title
                        break
                }

                // Manípular strings
                if (typeof valueA === "string" && typeof valueB === "string") {
                    return sortOption.direction === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
                }

                // Manípular numbers e outros tipos
                return sortOption.direction === "asc" ? (valueA || 0) - (valueB || 0) : (valueB || 0) - (valueA || 0)
            })
        }

        return result
    }, [searchTerm, initialItems, sortOption, activeFilter])

    // Calcular total de páginas
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredItems.length / pageSize))
    }, [filteredItems, pageSize])

    // Ajustar página atual se necessário
    useMemo(() => {
        if (currentPage > pageSize) {
            setCurrentPage(Math.max(1, totalPages))
        }
    }, [totalPages, currentPage])

    // Obter itens paginados
    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return filteredItems.slice(startIndex, startIndex + pageSize)
    }, [filteredItems, currentPage, pageSize])

    // Reset to first page when sorting changes
    useEffect(() => {
        setCurrentPage(1)
    }, [sortOption, activeFilter])

    const toggleItemSelection = (itemId: string) => {
        setSelectedItemIds((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
    }

    const toggleAllItems = (selected: boolean) => {
        if (selected) {
            // Selecionar todos os items filtrados
            setSelectedItemIds(filteredItems.map((item) => item.id))
        } else {
            // Desmarcar todos
            setSelectedItemIds([])
        }
    }

    const clearSelection = () => {
        setSelectedItemIds([])
    }

    const hasSelection = selectedItemIds.length > 0

    return (
        <CatalogItemsContext.Provider
            value={{
                items: initialItems,
                isPending,
                searchTerm,
                setSearchTerm,
                filteredItems,
                selectedItemIds,
                toggleItemSelection,
                toggleAllItems,
                clearSelection,
                hasSelection,
                currentPage,
                setCurrentPage,
                pageSize,
                setPageSize,
                paginatedItems,
                totalPages,
                sortOption,
                setSortOption,
                activeFilter,
                setActiveFilter,
            }}
        >
            {children}
        </CatalogItemsContext.Provider>
    )
}

export function useItems() {
    const context = useContext(CatalogItemsContext)
    if (context === undefined) {
        throw new Error("useItems must be used within a CatalogItemsProvider")
    }
    return context
}

