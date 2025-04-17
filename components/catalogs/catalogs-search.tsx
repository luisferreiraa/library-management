"use client"

import { useCatalogs } from "@/contexts/catalogs-context"
import { EntitiesSearch } from "../global-entities/entities-search"

export function CatalogsSearch() {
    const { searchTerm, setSearchTerm } = useCatalogs()

    return (
        <EntitiesSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Pesquisar Catálogos..."
        />
    )
}