"use client"

import { useUsers } from "@/contexts/users-context"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function UsersSearch() {
    const { searchTerm, setSearchTerm } = useUsers()

    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Pesquisar utilizadores..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    )
}

