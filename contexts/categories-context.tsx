"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition, useEffect } from "react"
import type { Category } from "@/lib/categories"

// Definir SortOption type
export type SortOption<T = Category> = {
    value: keyof T
    direction: "asc" | "desc"
}

// Definir FilterOption type para isActive
export type ActiveFilterOption = "all" | "active" | "inactive"

interface CategoriesContextType {
    categories: Category[]
    addCategory: (category: Category) => void
    removeCategories: (categoryIds: string[]) => void
    isPending: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredCategories: Category[]
    selectedCategoryIds: string[]
    toggleCategorySelection: (categoryId: string) => void
    toggleAllCategories: (selected: boolean) => void
    clearSelection: () => void
    hasSelection: boolean
    currentPage: number
    setCurrentPage: (page: number) => void
    pageSize: number
    setPageSize: (size: number) => void
    paginatedCategories: Category[]
    totalPages: number
    sortOption: SortOption<Category> | null
    setSortOption: (option: SortOption<Category>) => void
    activeFilter: ActiveFilterOption
    setActiveFilter: (filter: ActiveFilterOption) => void
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined)

export function CategoryProvider({
    children,
    initialCategories,
}: {
    children: ReactNode
    initialCategories: Category[]
}) {
    const [isPending, startTransition] = useTransition()
    const [optimisticCategories, updateCategories] = useOptimistic(
        initialCategories,
        (state, action: { type: "add"; category: Category } | { type: "remove"; categoryIds: string[] }) => {
            if (action.type === "add") {
                return [...state, action.category]
            } else if (action.type === "remove") {
                return state.filter((category) => !action.categoryIds.includes(category.id))
            }
            return state
        },
    )

    // Estado para pesquisa
    const [searchTerm, setSearchTerm] = useState("")

    // Estado para seleção de categorias
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])

    // Estado para paginação
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Estado para ordenação
    const [sortOption, setSortOption] = useState<SortOption<Category> | null>(null)

    // Estado para filtro de isActive
    const [activeFilter, setActiveFilter] = useState<ActiveFilterOption>("all")

    // useMemo é utilizado para evitar recalcular a lista filtrada sempre que o componente renderiza
    // garantindo melhor performance
    const filteredCategories = useMemo(() => {
        // Criamos uma cópia da lista de autores para evitar modificar o estado original
        let result = [...optimisticCategories]

        // Aplicar filtro por isActive
        if (activeFilter != "all") {
            const isActive = activeFilter === "active"
            result = result.filter((category) => category.isActive === isActive)
        }

        // Se houver um termo de pesquisa, filtramos os autores pelo nome ou biografia
        if (searchTerm !== "") {
            const lowerSearchTerm = searchTerm.toLowerCase()
            result = result.filter(
                (category) =>
                    category.name.toLowerCase().includes(lowerSearchTerm)
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
    }, [searchTerm, optimisticCategories, sortOption, activeFilter])     // Dependências: recalcula apenas quando uma delas mudar

    // Calcular total de páginas
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredCategories.length / pageSize))
    }, [filteredCategories, pageSize])

    // Ajustar página atual se necessário
    useMemo(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(1, totalPages))
        }
    }, [totalPages, currentPage])

    // Obter categorias paginadas
    const paginatedCategories = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return filteredCategories.slice(startIndex, startIndex + pageSize)
    }, [filteredCategories, currentPage, pageSize])

    // Resetar para a primeira página quando o sorting altera
    useEffect(() => {
        setCurrentPage(1)
    }, [sortOption, activeFilter])

    const addCategory = (category: Category) => {
        startTransition(() => {
            updateCategories({ type: "add", category })
        })
    }

    const removeCategories = (categoryIds: string[]) => {
        startTransition(() => {
            updateCategories({ type: "remove", categoryIds })
            // Limpar seleção após remover
            setSelectedCategoryIds((prev) => prev.filter((id) => !categoryIds.includes(id)))
        })
    }

    const toggleCategorySelection = (categoryId: string) => {
        setSelectedCategoryIds((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
        )
    }

    const toggleAllCategories = (selected: boolean) => {
        if (selected) {
            // Selecionar todas as categorias filtradas
            setSelectedCategoryIds(filteredCategories.map((category) => category.id))
        } else {
            // Desmarcar todas
            setSelectedCategoryIds([])
        }
    }

    const clearSelection = () => {
        setSelectedCategoryIds([])
    }

    const hasSelection = selectedCategoryIds.length > 0

    return (
        <CategoriesContext.Provider
            value={{
                categories: optimisticCategories,
                addCategory,
                removeCategories,
                isPending,
                searchTerm,
                setSearchTerm,
                filteredCategories,
                selectedCategoryIds,
                toggleCategorySelection,
                toggleAllCategories,
                clearSelection,
                hasSelection,
                currentPage,
                setCurrentPage,
                pageSize,
                setPageSize,
                paginatedCategories,
                totalPages,
                sortOption,
                setSortOption,
                activeFilter,
                setActiveFilter,
            }}
        >
            {children}
        </CategoriesContext.Provider>
    )
}

export function useCategories() {
    const context = useContext(CategoriesContext)
    if (context === undefined) {
        throw new Error("useCategories must be used within a CategoriesProvider")
    }
    return context
}
