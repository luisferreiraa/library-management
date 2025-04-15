"use client"

import { useLibraries } from "@/contexts/libraries-context"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { EntitiesSearch } from "../global-entities/entities-search"

export function LibrariesSearch() {
    const { searchTerm, setSearchTerm } = useLibraries()

    return (
        <EntitiesSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Pesquisar bibliotecas..."
        />
    )
}

