"use client"

import { createContext, useContext, type ReactNode, useOptimistic, useTransition } from "react"
import type { Language } from "@/lib/languages"

interface LanguagesContextType {
    languages: Language[]
    addLanguage: (language: Language) => void
    isPending: boolean
}

const LanguagesContext = createContext<LanguagesContextType | undefined>(undefined)

export function LanguagesProvider({
    children,
    initialLanguages,
}: {
    children: ReactNode
    initialLanguages: Language[]
}) {
    const [isPending, startTransition] = useTransition()
    const [optimisticLanguages, addOptimisticLanguage] = useOptimistic(initialLanguages, (state, newLanguage: Language) => [
        ...state,
        newLanguage,
    ])

    const addLanguage = (language: Language) => {
        startTransition(() => {
            addOptimisticLanguage(language)
        })
    }

    return (
        <LanguagesContext.Provider
            value={{
                languages: optimisticLanguages,
                addLanguage,
                isPending
            }}
        >
            {children}
        </LanguagesContext.Provider>
    )
}

export function useLanguages() {
    const context = useContext(LanguagesContext)
    if (context === undefined) {
        throw new Error("useLanguages must be used within a LanguagesProvider")
    }
    return context
}
