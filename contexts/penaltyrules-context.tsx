"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition } from "react"
import type { PenaltyRule } from "@/lib/penaltyrules"

interface PenaltyRulesContextType {
    penaltyRules: PenaltyRule[]
    addPenaltyRule: (penaltyRule: PenaltyRule) => void
    removePenaltyRules: (penaltyRuleIds: string[]) => void
    isPending: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredPenaltyRules: PenaltyRule[]
    selectedPenaltyRuleIds: string[]
    togglePenaltyRuleSelection: (penaltyRuleId: string) => void
    toggleAllPenaltyRules: (selected: boolean) => void
    clearSelection: () => void
    hasSelection: boolean
}

const PenaltyRulesContext = createContext<PenaltyRulesContextType | undefined>(undefined)

export function PenaltyRulesProvider({
    children,
    initialPenaltyRules,
}: {
    children: ReactNode
    initialPenaltyRules: PenaltyRule[]
}) {
    const [isPending, startTransition] = useTransition()
    const [optimisticPenaltyRules, updatePenaltyRules] = useOptimistic(
        initialPenaltyRules,
        (state, action: { type: "add"; penaltyRule: PenaltyRule } | { type: "remove"; penaltyRuleIds: string[] }) => {
            if (action.type === "add") {
                return [...state, action.penaltyRule]
            } else if (action.type === "remove") {
                return state.filter((penaltyRule) => !action.penaltyRuleIds.includes(penaltyRule.id))
            }
            return state
        },
    )

    // Estado para pesquisa
    const [searchTerm, setSearchTerm] = useState("")

    // Estado para seleção de penalty rules
    const [selectedPenaltyRuleIds, setSelectedPenaltyRuleIds] = useState<string[]>([])

    // Usar useMemo em vez de useEffect + useState para filtrar penalty rules
    const filteredPenaltyRules = useMemo(() => {
        if (searchTerm === "") {
            return optimisticPenaltyRules
        }

        return optimisticPenaltyRules.filter((penaltyRule) => penaltyRule.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [searchTerm, optimisticPenaltyRules])

    const addPenaltyRule = (penaltyRule: PenaltyRule) => {
        startTransition(() => {
            updatePenaltyRules({ type: "add", penaltyRule })
        })
    }

    const removePenaltyRules = (penaltyRuleIds: string[]) => {
        startTransition(() => {
            updatePenaltyRules({ type: "remove", penaltyRuleIds })
            // Limpar seleção após remover
            setSelectedPenaltyRuleIds((prev) => prev.filter((id) => !penaltyRuleIds.includes(id)))
        })
    }

    const togglePenaltyRuleSelection = (penaltyRuleId: string) => {
        setSelectedPenaltyRuleIds((prev) =>
            prev.includes(penaltyRuleId) ? prev.filter((id) => id !== penaltyRuleId) : [...prev, penaltyRuleId],
        )
    }

    const toggleAllPenaltyRules = (selected: boolean) => {
        if (selected) {
            // Selecionar todas as penalty rules filtradas
            setSelectedPenaltyRuleIds(filteredPenaltyRules.map((penaltyRule) => penaltyRule.id))
        } else {
            // Desmarcar todas
            setSelectedPenaltyRuleIds([])
        }
    }

    const clearSelection = () => {
        setSelectedPenaltyRuleIds([])
    }

    const hasSelection = selectedPenaltyRuleIds.length > 0

    return (
        <PenaltyRulesContext.Provider
            value={{
                penaltyRules: optimisticPenaltyRules,
                addPenaltyRule,
                removePenaltyRules,
                isPending,
                searchTerm,
                setSearchTerm,
                filteredPenaltyRules,
                selectedPenaltyRuleIds,
                togglePenaltyRuleSelection,
                toggleAllPenaltyRules,
                clearSelection,
                hasSelection,
            }}
        >
            {children}
        </PenaltyRulesContext.Provider>
    )
}

export function usePenaltyRules() {
    const context = useContext(PenaltyRulesContext)
    if (context === undefined) {
        throw new Error("usePenaltyRules must be used within a PenaltyRulesProvider")
    }
    return context
}
