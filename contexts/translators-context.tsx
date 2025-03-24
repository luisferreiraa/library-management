"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition } from "react"
import type { Translator } from "@/lib/translators"

interface TranslatorsContextType {
    translators: Translator[]
    addTranslator: (translator: Translator) => void
    removeTranslators: (translatorIds: string[]) => void
    isPending: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredTranslators: Translator[]
    selectedTranslatorIds: string[]
    toggleTranslatorSelection: (translatorId: string) => void
    toggleAllTranslators: (selected: boolean) => void
    clearSelection: () => void
    hasSelection: boolean
    currentPage: number
    setCurrentPage: (page: number) => void
    pageSize: number
    setPageSize: (size: number) => void
    paginatedTranslators: Translator[]
    totalPages: number
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
    const [optimisticTranslators, updateTranslators] = useOptimistic(
        initialTranslators,
        (state, action: { type: "add"; translator: Translator } | { type: "remove"; translatorIds: string[] }) => {
            if (action.type === "add") {
                return [...state, action.translator]
            } else if (action.type === "remove") {
                return state.filter((translator) => !action.translatorIds.includes(translator.id))
            }
            return state
        },
    )

    // Estado para pesquisa
    const [searchTerm, setSearchTerm] = useState("")

    // Estado para seleção de tradutores
    const [selectedTranslatorIds, setSelectedTranslatorIds] = useState<string[]>([])

    // Estado para paginação
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Usar useMemo em vez de useEffect + useState para filtrar tradutores
    const filteredTranslators = useMemo(() => {
        if (searchTerm === "") {
            return optimisticTranslators
        }

        return optimisticTranslators.filter((translator) => translator.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [searchTerm, optimisticTranslators])

    // Calcular total de páginas
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredTranslators.length / pageSize))
    }, [filteredTranslators, pageSize])

    // Ajustar página atual se necessário
    useMemo(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(1, totalPages))
        }
    }, [totalPages, currentPage])

    // Obter autores paginados
    const paginatedTranslators = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return filteredTranslators.slice(startIndex, startIndex + pageSize)
    }, [filteredTranslators, currentPage, pageSize])

    const addTranslator = (translator: Translator) => {
        startTransition(() => {
            updateTranslators({ type: "add", translator })
        })
    }

    const removeTranslators = (translatorIds: string[]) => {
        startTransition(() => {
            updateTranslators({ type: "remove", translatorIds })
            // Limpar seleção após remover
            setSelectedTranslatorIds((prev) => prev.filter((id) => !translatorIds.includes(id)))
        })
    }

    const toggleTranslatorSelection = (translatorId: string) => {
        setSelectedTranslatorIds((prev) =>
            prev.includes(translatorId) ? prev.filter((id) => id !== translatorId) : [...prev, translatorId],
        )
    }

    const toggleAllTranslators = (selected: boolean) => {
        if (selected) {
            // Selecionar todas os tradutores filtrados
            setSelectedTranslatorIds(filteredTranslators.map((translator) => translator.id))
        } else {
            // Desmarcar todas
            setSelectedTranslatorIds([])
        }
    }

    const clearSelection = () => {
        setSelectedTranslatorIds([])
    }

    const hasSelection = selectedTranslatorIds.length > 0

    return (
        <TranslatorsContext.Provider
            value={{
                translators: optimisticTranslators,
                addTranslator,
                removeTranslators,
                isPending,
                searchTerm,
                setSearchTerm,
                filteredTranslators,
                selectedTranslatorIds,
                toggleTranslatorSelection,
                toggleAllTranslators,
                clearSelection,
                hasSelection,
                currentPage,
                setCurrentPage,
                pageSize,
                setPageSize,
                paginatedTranslators,
                totalPages,
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
