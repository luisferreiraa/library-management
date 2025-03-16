"use client"

import { createContext, useContext, type ReactNode, useOptimistic, useTransition } from "react"
import type { Format } from "@/lib/formats"

interface FormatsContextType {
    formats: Format[]
    addFormat: (format: Format) => void
    isPending: boolean
}

const FormatsContext = createContext<FormatsContextType | undefined>(undefined)

export function FormatsProvider({
    children,
    initialFormats,
}: {
    children: ReactNode
    initialFormats: Format[]
}) {
    const [isPending, startTransition] = useTransition()
    const [optimisticFormats, addOptimisticFormat] = useOptimistic(initialFormats, (state, newFormat: Format) => [
        ...state,
        newFormat,
    ])

    const addFormat = (format: Format) => {
        startTransition(() => {
            addOptimisticFormat(format)
        })
    }

    return (
        <FormatsContext.Provider
            value={{
                formats: optimisticFormats,
                addFormat,
                isPending
            }}
        >
            {children}
        </FormatsContext.Provider>
    )
}

export function useFormats() {
    const context = useContext(FormatsContext)
    if (context === undefined) {
        throw new Error("useFormats must be used within a FormatsProvider")
    }
    return context
}
