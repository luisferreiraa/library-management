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
import { useBookStatuses, type SortOption } from "@/contexts/bookstatus-context"
import { cn } from "@/lib/utils"

const sortOptions: (SortOption & { label: string })[] = [
    { label: "Nome (A-Z)", value: "name", direction: "asc" },
    { label: "Nome (Z-A)", value: "name", direction: "desc" },
    { label: "Data de registo (mais recente)", value: "createdAt", direction: "desc" },
    { label: "Data de registo (mais antiga)", value: "createdAt", direction: "asc" },
]

export function OrderBookStatusBy() {
    const { sortOption, setSortOption } = useBookStatuses()

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

