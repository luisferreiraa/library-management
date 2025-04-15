"use client"

import { useLibraries } from "@/contexts/libraries-context"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function LibrariesSearch() {
    const { searchTerm, setSearchTerm } = useLibraries()

    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Pesquisar bibliotecas..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    )
}

