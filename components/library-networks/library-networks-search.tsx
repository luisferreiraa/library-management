"use client"

import { useLibraryNetworks } from "@/contexts/library-networks-context"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { EntitiesSearch } from "../global-entities/entities-search"

export function LibraryNetworksSearch() {
    const { searchTerm, setSearchTerm } = useLibraryNetworks()

    return (
        <EntitiesSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Pesquisar redes de bibliotecas..."
        />
    )
}

