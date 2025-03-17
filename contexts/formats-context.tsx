"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition } from "react"
import type { Format } from "@/lib/formats"

interface FormatsContextType {
    formats: Format[]
    addFormat: (format: Format) => void
    removeFormats: (formatIds: string[]) => void
    isPending: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredFormats: Format[]
    selectedFormatIds: string[]
    toggleFormatSelection: (formatId: string) => void
    toggleAllFormats: (selected: boolean) => void
    clearSelection: () => void
    hasSelection: boolean
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
    const [optimisticFormats, updateFormats] = useOptimistic(
        initialFormats,
        (state, action: { type: "add"; format: Format } | { type: "remove"; formatIds: string[] }) => {
            if (action.type === "add") {
                return [...state, action.format]
            } else if (action.type === "remove") {
                return state.filter((format) => !action.formatIds.includes(format.id))
            }
            return state
        },
    )

    // Estado para pesquisa
    const [searchTerm, setSearchTerm] = useState("")

    // Estado para seleção de formatos
    const [selectedFormatIds, setSelectedFormatIds] = useState<string[]>([])

    // Usar useMemo em vez de useEffect + useState para filtrar formatos
    const filteredFormats = useMemo(() => {
        if (searchTerm === "") {
            return optimisticFormats
        }

        return optimisticFormats.filter((format) => format.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [searchTerm, optimisticFormats])

    const addFormat = (format: Format) => {
        startTransition(() => {
            updateFormats({ type: "add", format })
        })
    }

    const removeFormats = (formatIds: string[]) => {
        startTransition(() => {
            updateFormats({ type: "remove", formatIds })
            // Limpar seleção após remover
            setSelectedFormatIds((prev) => prev.filter((id) => !formatIds.includes(id)))
        })
    }

    const toggleFormatSelection = (formatId: string) => {
        setSelectedFormatIds((prev) =>
            prev.includes(formatId) ? prev.filter((id) => id !== formatId) : [...prev, formatId],
        )
    }

    const toggleAllFormats = (selected: boolean) => {
        if (selected) {
            // Selecionar todas os formatos filtradas
            setSelectedFormatIds(filteredFormats.map((format) => format.id))
        } else {
            // Desmarcar todas
            setSelectedFormatIds([])
        }
    }

    const clearSelection = () => {
        setSelectedFormatIds([])
    }

    const hasSelection = selectedFormatIds.length > 0

    return (
        <FormatsContext.Provider
            value={{
                formats: optimisticFormats,
                addFormat,
                removeFormats,
                isPending,
                searchTerm,
                setSearchTerm,
                filteredFormats,
                selectedFormatIds,
                toggleFormatSelection,
                toggleAllFormats,
                clearSelection,
                hasSelection,
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
