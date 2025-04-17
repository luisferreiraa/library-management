"use client"

import { useBookStatus } from "@/contexts/bookstatus-context"
import { EntitiesSearch } from "../global-entities/entities-search"

export function BookStatusSearch() {
    const { searchTerm, setSearchTerm } = useBookStatus()

    return (
        <EntitiesSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Pesquisar status..."
        />
    )
}

