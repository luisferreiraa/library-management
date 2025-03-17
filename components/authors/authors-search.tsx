"use client"

import { useAuthors } from "@/contexts/authors-context"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function AuthorsSearch() {
    const { searchTerm, setSearchTerm } = useAuthors()

    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Pesquisar autores..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    )
}

