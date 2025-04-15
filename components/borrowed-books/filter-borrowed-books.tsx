"use client"

import { useBorrowedBooks } from "@/contexts/borrowed-books-context"
import { FilterEntities } from "../global-entities/filter-entities"
import type { ActiveFilterOption } from "@/types/types"

const filterOptions = [
    { value: "all", label: "Todos" },
    { value: "active", label: "A decorrer" },
    { value: "inactive", label: "Devolvidos" },
] as const

export function FilterBorrowedBooks() {
    const { activeFilter, setActiveFilter } = useBorrowedBooks()


    return (
        <FilterEntities<ActiveFilterOption>
            value={activeFilter}
            onValueChange={setActiveFilter}
            options={filterOptions}
            label="Estado:"
            placeholder="Filtrar Empréstimos"
        />
    )
}