"use client"

import { useBorrowedBooks } from "@/contexts/borrowed-books-context"
import { OrderEntityBy } from "../global-entities/order-entity-by"
import { BorrowedBookWithRelations } from "@/lib/borrowed-books"


const sortOptions = [
    { label: "ID (ascendente)", value: "id", direction: "asc" },
    { label: "ID (descendente)", value: "id", direction: "desc" },
    { label: "Data de empréstimo (mais recente)", value: "borrowedAt", direction: "desc" },
    { label: "Data de empréstimo (mais antiga)", value: "borrowedAt", direction: "asc" },
    { label: "Prazo p/ devolução (mais recente)", value: "dueDate", direction: "desc" },
    { label: "Prazo p/ devolução (mais antiga)", value: "dueDate", direction: "asc" },
    { label: "Data de devolução (mais recente)", value: "returnDate", direction: "desc" },
    { label: "Data de devolução (mais antiga)", value: "returnDate", direction: "asc" },
    { label: "Multa (mais baixo)", value: "fineValue", direction: "desc" },
    { label: "Multa (mais elevado)", value: "fineValue", direction: "asc" },
] as const

export function OrderBorrowedBooksBy() {
    const { sortOption, setSortOption } = useBorrowedBooks()

    return (
        <OrderEntityBy<BorrowedBookWithRelations>
            sortOptions={[...sortOptions]}
            currentSort={sortOption}
            onSortChange={setSortOption}
            defaultLabel="Ordenar empréstimos por"
        />
    )
}

