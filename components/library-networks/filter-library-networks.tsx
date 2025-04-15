"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useLibraryNetworks } from "@/contexts/library-networks-context"
import type { ActiveFilterOption } from "@/types/types"

export function FilterLibraryNetworks() {
    const { activeFilter, setActiveFilter } = useLibraryNetworks()

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
                    <SelectValue placeholder="Filtrar por Rede de Bibliotecas" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}