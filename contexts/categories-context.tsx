"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition } from "react"
import type { Category } from "@/lib/categories"

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

    // Usar useMemo em vez de useEffect + useState para filtrar categorias
    const filteredCategories = useMemo(() => {
        if (searchTerm === "") {
            return optimisticCategories
        }

        return optimisticCategories.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [searchTerm, optimisticCategories])

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
