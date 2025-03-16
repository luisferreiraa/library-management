"use client"

import { createContext, useContext, type ReactNode, useOptimistic, useTransition } from "react"
import type { PenaltyRule } from "@/lib/penaltyrules"

interface PenaltyRulesContextType {
    penaltyRules: PenaltyRule[]
    addPenaltyRule: (penaltyRule: PenaltyRule) => void
    isPending: boolean
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
    const [optimisticPenaltyRules, addOptimisticPenaltyRule] = useOptimistic(initialPenaltyRules, (state, newPenaltyRule: PenaltyRule) => [
        ...state,
        newPenaltyRule,
    ])

    const addPenaltyRule = (penaltyRule: PenaltyRule) => {
        startTransition(() => {
            addOptimisticPenaltyRule(penaltyRule)
        })
    }

    return (
        <PenaltyRulesContext.Provider
            value={{
                penaltyRules: optimisticPenaltyRules,
                addPenaltyRule,
                isPending
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
