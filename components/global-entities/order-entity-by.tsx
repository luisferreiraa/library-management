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
import { cn } from "@/lib/utils"
import type { SortOption } from "@/types/types"

interface OrderEntityByProps<T> {
    sortOptions: (SortOption<T> & { label: string })[]
    currentSort: SortOption<T> | null
    onSortChange: (option: SortOption<T>) => void
    defaultLabel?: string
    className?: string
}

export function OrderEntityBy<T>({
    sortOptions,
    currentSort,
    onSortChange,
    defaultLabel = "Ordenar por",
    className,
}: OrderEntityByProps<T>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-between", className)}>
                    <span className="truncate">
                        {currentSort
                            ? sortOptions.find(
                                (option) =>
                                    option.value === currentSort.value &&
                                    option.direction === currentSort.direction
                            )?.label
                            : defaultLabel}
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
                            key={`${String(option.value)}-${option.direction}`}
                            onClick={() => onSortChange(option)}
                            className={cn(
                                "flex cursor-pointer items-center justify-between",
                                currentSort?.value === option.value &&
                                    currentSort?.direction === option.direction ? "bg-accent" : ""
                            )}
                        >
                            {option.label}
                            {currentSort?.value === option.value &&
                                currentSort?.direction === option.direction && (
                                    <Check className="h-4 w-4" />
                                )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}