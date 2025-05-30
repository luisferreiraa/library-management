"use client"

import { useTranslators } from "@/contexts/translators-context"
import { EntitiesSearch } from "../global-entities/entities-search"

export function TranslatorsSearch() {
    const { searchTerm, setSearchTerm } = useTranslators()

    return (
        <EntitiesSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Pesquisar tradutores..."
        />
    )
}

