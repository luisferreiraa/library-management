"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface EntitiesSearchProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    placeholder?: string
    className?: string
    inputClassName?: string
    iconClassName?: string
}

export function EntitiesSearch({
    searchTerm,
    setSearchTerm,
    placeholder = "Pesquisar...",
    className,
    inputClassName,
    iconClassName,
}: EntitiesSearchProps) {
    return (
        <div className={cn("relative", className)}>
            <Search className={cn(
                "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground",
                iconClassName
            )} />
            <Input
                type="search"
                placeholder={placeholder}
                className={cn("pl-8", inputClassName)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    )
}