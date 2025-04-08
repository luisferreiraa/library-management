"use client"

import { useBorrowedBooks, type ActiveFilterOption } from "@/contexts/borrowed-books-context"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function FilterBorrowedBooks() {
    const { activeFilter, setActiveFilter } = useBorrowedBooks()

    const handleFilterChange = (value: string) => {
        setActiveFilter(value as ActiveFilterOption)
    }

    return (
        <div className="flex items-center gap-3">
            <Label htmlFor="status-filter" className="text-sm font-medium">
                Estado:
            </Label>
            <Select value={activeFilter} onValueChange={handleFilterChange}>
                <SelectTrigger id="status-filter" className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">A decorrer</SelectItem>
                    <SelectItem value="inactive">Devolvidos</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}