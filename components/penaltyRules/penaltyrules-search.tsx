"use client"

import { usePenaltyRules } from "@/contexts/penaltyrules-context"
import { EntitiesSearch } from "../global-entities/entities-search"

export function PenaltyRulesSearch() {
    const { searchTerm, setSearchTerm } = usePenaltyRules()

    return (
        <EntitiesSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Pesquisar regras..."
        />
    )
}

