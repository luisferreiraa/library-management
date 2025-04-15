"use client"

import { usePublishers } from "@/contexts/publishers-context"
import { EntitiesSearch } from "../global-entities/entities-search"

export function PublishersSearch() {
    const { searchTerm, setSearchTerm } = usePublishers()

    return (
        <EntitiesSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Pesquisar editoras..."
        />
    )
}

