"use client"

import { usePublishers, type ActiveFilterOption } from "@/contexts/publishers-context"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function FilterPublishers() {
    const { activeFilter, setActiveFilter } = usePublishers()

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
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}