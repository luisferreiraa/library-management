"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition } from "react"
import type { Language } from "@/lib/languages"

interface LanguagesContextType {
    languages: Language[]
    addLanguage: (language: Language) => void
    removeLanguages: (languageIds: string[]) => void
    isPending: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredLanguages: Language[]
    selectedLanguageIds: string[]
    toggleLanguageSelection: (languageId: string) => void
    toggleAllLanguages: (selected: boolean) => void
    clearSelection: () => void
    hasSelection: boolean
    currentPage: number
    setCurrentPage: (page: number) => void
    pageSize: number
    setPageSize: (size: number) => void
    paginatedLanguages: Language[]
    totalPages: number
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
    const [optimisticLanguages, updateLanguages] = useOptimistic(
        initialLanguages,
        (state, action: { type: "add"; language: Language } | { type: "remove"; languageIds: string[] }) => {
            if (action.type === "add") {
                return [...state, action.language]
            } else if (action.type === "remove") {
                return state.filter((language) => !action.languageIds.includes(language.id))
            }
            return state
        },
    )

    // Estado para pesquisa
    const [searchTerm, setSearchTerm] = useState("")

    // Estado para seleção de idiomas
    const [selectedLanguageIds, setSelectedLanguageIds] = useState<string[]>([])

    // Estado para paginação
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Usar useMemo em vez de useEffect + useState para filtrar idiomas
    const filteredLanguages = useMemo(() => {
        if (searchTerm === "") {
            return optimisticLanguages
        }

        return optimisticLanguages.filter((language) => language.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [searchTerm, optimisticLanguages])

    // Calcular total de páginas
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredLanguages.length / pageSize))
    }, [filteredLanguages, pageSize])

    // Ajustar página atual se necessário
    useMemo(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(1, totalPages))
        }
    }, [totalPages, currentPage])

    // Obter languages paginadas
    const paginatedLanguages = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return filteredLanguages.slice(startIndex, startIndex + pageSize)
    }, [filteredLanguages, currentPage, pageSize])

    const addLanguage = (language: Language) => {
        startTransition(() => {
            updateLanguages({ type: "add", language })
        })
    }

    const removeLanguages = (languageIds: string[]) => {
        startTransition(() => {
            updateLanguages({ type: "remove", languageIds })
            // Limpar seleção após remover
            setSelectedLanguageIds((prev) => prev.filter((id) => !languageIds.includes(id)))
        })
    }

    const toggleLanguageSelection = (languageId: string) => {
        setSelectedLanguageIds((prev) =>
            prev.includes(languageId) ? prev.filter((id) => id !== languageId) : [...prev, languageId],
        )
    }

    const toggleAllLanguages = (selected: boolean) => {
        if (selected) {
            // Selecionar todos os idiomas filtrados
            setSelectedLanguageIds(filteredLanguages.map((language) => language.id))
        } else {
            // Desmarcar todas
            setSelectedLanguageIds([])
        }
    }

    const clearSelection = () => {
        setSelectedLanguageIds([])
    }

    const hasSelection = selectedLanguageIds.length > 0

    return (
        <LanguagesContext.Provider
            value={{
                languages: optimisticLanguages,
                addLanguage,
                removeLanguages,
                isPending,
                searchTerm,
                setSearchTerm,
                filteredLanguages,
                selectedLanguageIds,
                toggleLanguageSelection,
                toggleAllLanguages,
                clearSelection,
                hasSelection,
                currentPage,
                setCurrentPage,
                pageSize,
                setPageSize,
                paginatedLanguages,
                totalPages,
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
