"use client"

import { useLanguages } from "@/contexts/languages-context"
import { EntitiesSearch } from "../global-entities/entities-search"

export function LanguagesSearch() {
    const { searchTerm, setSearchTerm } = useLanguages()

    return (
        <EntitiesSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Pesquisar idiomas..."
        />
    )
}

