"use client"

import { createContext, useContext, type ReactNode, useOptimistic, useTransition } from "react"
import type { Category } from "@/lib/categories"

interface CategoriesContextType {
    categories: Category[]
    addCategory: (category: Category) => void
    isPending: boolean
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
    const [optimisticCategories, addOptimisticCategory] = useOptimistic(initialCategories, (state, newCategory: Category) => [
        ...state,
        newCategory,
    ])

    const addCategory = (category: Category) => {
        startTransition(() => {
            addOptimisticCategory(category)
        })
    }

    return (
        <CategoriesContext.Provider
            value={{
                categories: optimisticCategories,
                addCategory,
                isPending
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
