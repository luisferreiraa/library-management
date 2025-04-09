"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition, useEffect } from "react"
import type { Language } from "@/lib/languages"

// Definir SortOption type
export type SortOption = {
    value: string
    direction: "asc" | "desc"
}

// Definir FilterOption type para isActive
export type ActiveFilterOption = "all" | "active" | "inactive"

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
    sortOption: SortOption | null
    setSortOption: (option: SortOption) => void
    activeFilter: ActiveFilterOption
    setActiveFilter: (filter: ActiveFilterOption) => void
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

    // Estado para ordenação
    const [sortOption, setSortOption] = useState<SortOption | null>(null)

    // Estado para filtro de isActive
    const [activeFilter, setActiveFilter] = useState<ActiveFilterOption>("all")

    // useMemo é utilizado para evitar recalcular a lista filtrada sempre que o componente renderiza
    // garantindo melhor performance
    const filteredLanguages = useMemo(() => {
        // Criamos uma cópia da lista de autores para evitar modificar o estado original
        let result = [...optimisticLanguages]

        // Aplicar filtro por isActive
        if (activeFilter != "all") {
            const isActive = activeFilter === "active"
            result = result.filter((language) => language.isActive === isActive)
        }

        // Se houver um termo de pesquisa, filtramos os autores pelo nome ou biografia
        if (searchTerm !== "") {
            const lowerSearchTerm = searchTerm.toLowerCase()
            result = result.filter(
                (language) =>
                    language.name.toLowerCase().includes(lowerSearchTerm)
            )
        }

        // Se houver uma opção de ordenação selecionada, aplicamos a ordenação
        if (sortOption) {
            result.sort((a, b) => {
                let valueA: any, valueB: any

                switch (sortOption.value) {
                    case "name":
                        // Ordenação pelo nome (string)
                        valueA = a.name
                        valueB = b.name
                        break
                    case "createdAt":
                        // Ordenação pela data de criação (convertida para timestamp para comparação numérica)
                        valueA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                        valueB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                        break
                    default:
                        // Ordenação padrão pelo nome caso a opção não seja reconhecida
                        valueA = a.name
                        valueB = b.name
                        break
                }

                // Se os valores forem strings, usamos localCompare para garantir ordenação alfabética correta
                if (typeof valueA === "string" && typeof valueB === "string") {
                    return sortOption.direction === "asc"
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA)
                }

                // Caso contrário, ordenamos numericamente (ex: datas convertidas em timestamps)
                return sortOption.direction === "asc"
                    ? (valueA || 0) - (valueB || 0)
                    : (valueB || 0) - (valueA || 0)
            })
        }

        // Retornamos a lista filtrada e ordenada
        return result
    }, [searchTerm, optimisticLanguages, sortOption, activeFilter])     // Dependências: recalcula apenas quando uma delas mudar

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

    // Resetar para a primeira página quando o sorting altera
    useEffect(() => {
        setCurrentPage(1)
    }, [sortOption, activeFilter])

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
                sortOption,
                setSortOption,
                activeFilter,
                setActiveFilter,
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
