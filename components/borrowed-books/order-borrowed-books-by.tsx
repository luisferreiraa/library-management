"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBorrowedBooks, type SortOption } from "@/contexts/borrowed-books-context"
import { cn } from "@/lib/utils"

const sortOptions: (SortOption & { label: string })[] = [
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
]

export function OrderBorrowedBooksBy() {
    const { sortOption, setSortOption } = useBorrowedBooks()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                    <span className="truncate">
                        {sortOption
                            ? sortOptions.find(
                                (option) => option.value === sortOption.value && option.direction === sortOption.direction,
                            )?.label
                            : "Ordenar por"}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {sortOptions.map((option) => (
                        <DropdownMenuItem
                            key={`${option.value}-${option.direction}`}
                            onClick={() => setSortOption(option)}
                            className={cn(
                                "flex cursor-pointer items-center justify-between",
                                sortOption?.value === option.value && sortOption?.direction === option.direction ? "bg-accent" : "",
                            )}
                        >
                            {option.label}
                            {sortOption?.value === option.value && sortOption?.direction === option.direction && (
                                <Check className="h-4 w-4" />
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

