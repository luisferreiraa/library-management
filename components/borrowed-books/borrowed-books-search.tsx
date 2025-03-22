"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useBorrowedBooks } from "@/contexts/borrowed-books-context"

export function BorrowedBooksSearch() {
    const { searchTerm, setSearchTerm } = useBorrowedBooks()

    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Pesquisar empréstimo..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    )
}

