"use client"

import { useBorrowedBooks } from "@/contexts/borrowed-books-context"
import { EntitiesSearch } from "../global-entities/entities-search"

export function BorrowedBooksSearch() {
    const { searchTerm, setSearchTerm } = useBorrowedBooks()

    return (
        <EntitiesSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Pesquisar empréstimos..."
        />
    )
}

