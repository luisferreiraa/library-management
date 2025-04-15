"use client"

import { useUsers } from "@/contexts/users-context"
import { EntitiesSearch } from "../global-entities/entities-search"

export function UsersSearch() {
    const { searchTerm, setSearchTerm } = useUsers()

    return (
        <EntitiesSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Pesquisar utilizadores..."
        />
    )
}

