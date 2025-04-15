"use client"

import { useFormats } from "@/contexts/formats-context"
import { EntitiesSearch } from "../global-entities/entities-search"

export function FormatsSearch() {
    const { searchTerm, setSearchTerm } = useFormats()

    return (
        <EntitiesSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Pesquisar formatos..."
        />
    )
}

