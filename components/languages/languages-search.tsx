"use client"

import { useLanguages } from "@/contexts/languages-context"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function LanguagesSearch() {
    const { searchTerm, setSearchTerm } = useLanguages()

    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Pesquisar idiomas..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    )
}

