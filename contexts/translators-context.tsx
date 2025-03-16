"use client"

import { createContext, useContext, type ReactNode, useOptimistic, useTransition } from "react"
import type { Translator } from "@/lib/translators"

interface TranslatorsContextType {
    translators: Translator[]
    addTranslator: (translator: Translator) => void
    isPending: boolean
}

const TranslatorsContext = createContext<TranslatorsContextType | undefined>(undefined)

export function TranslatorsProvider({
    children,
    initialTranslators,
}: {
    children: ReactNode
    initialTranslators: Translator[]
}) {
    const [isPending, startTransition] = useTransition()
    const [optimisticTranslators, addOptimisticTranslator] = useOptimistic(initialTranslators, (state, newTranslator: Translator) => [
        ...state,
        newTranslator,
    ])

    const addTranslator = (translator: Translator) => {
        startTransition(() => {
            addOptimisticTranslator(translator)
        })
    }

    return (
        <TranslatorsContext.Provider
            value={{
                translators: optimisticTranslators,
                addTranslator,
                isPending
            }}
        >
            {children}
        </TranslatorsContext.Provider>
    )
}

export function useTranslators() {
    const context = useContext(TranslatorsContext)
    if (context === undefined) {
        throw new Error("useTranslators must be used within a TranslatorsProvider")
    }
    return context
}
