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
import { useBooks, type SortOption } from "@/contexts/books-context"
import { cn } from "@/lib/utils"

const sortOptions: (SortOption & { label: string })[] = [
    { label: "Título (A-Z)", value: "title", direction: "asc" },
    { label: "Título (Z-A)", value: "title", direction: "desc" },
    { label: "Autor (A-Z)", value: "author.name", direction: "asc" },
    { label: "Autor (Z-A)", value: "author.name", direction: "desc" },
    { label: "Editora (A-Z)", value: "publisher.name", direction: "asc" },
    { label: "Editora (Z-A)", value: "publisher.name", direction: "desc" },
    { label: "Data de publicação (mais recente)", value: "publishingDate", direction: "desc" },
    { label: "Data de publicação (mais antiga)", value: "publishingDate", direction: "asc" },
    { label: "ISBN", value: "isbn", direction: "asc" },
]

export function OrderBooksBy() {
    const { sortOption, setSortOption } = useBooks()

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

