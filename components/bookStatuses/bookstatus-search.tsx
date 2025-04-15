"use client"

import { useBookStatuses } from "@/contexts/bookstatus-context"
import { EntitiesSearch } from "../global-entities/entities-search"

export function BookStatusSearch() {
    const { searchTerm, setSearchTerm } = useBookStatuses()

    return (
        <EntitiesSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Pesquisar status..."
        />
    )
}

