"use client"

import { useCategories } from "@/contexts/categories-context"
import { EntitiesSearch } from "../global-entities/entities-search"

export function CategoriesSearch() {
    const { searchTerm, setSearchTerm } = useCategories()

    return (
        <EntitiesSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Pesquisar categorias..."
        />
    )
}

