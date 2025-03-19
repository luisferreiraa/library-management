"use client"

import { useBooks } from "@/contexts/books-context"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function BooksSearch() {
    const { searchTerm, setSearchTerm } = useBooks()

    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Pesquisar livros por título, ISBN, autor ou editora..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    )
}

