"use client"

import { useRoles } from "@/contexts/roles-context"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function RolesSearch() {
    const { searchTerm, setSearchTerm } = useRoles()

    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Pesquisar roles..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    )
}

