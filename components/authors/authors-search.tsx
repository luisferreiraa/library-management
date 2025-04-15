"use client"

import { useAuthors } from "@/contexts/authors-context"
import { EntitiesSearch } from "../global-entities/entities-search"

export function AuthorsSearch() {
    const { searchTerm, setSearchTerm } = useAuthors()

    return (
        <EntitiesSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Pesquisar autores..."
        />
    )
}

