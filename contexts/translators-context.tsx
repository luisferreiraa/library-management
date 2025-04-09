"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition, useEffect } from "react"
import type { Translator } from "@/lib/translators"

// Definir SortOption type
export type SortOption = {
    value: string
    direction: "asc" | "desc"
}

// Definir FilterOption type para isActive
export type ActiveFilterOption = "all" | "active" | "inactive"

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
    sortOption: SortOption | null
    setSortOption: (option: SortOption) => void
    activeFilter: ActiveFilterOption
    setActiveFilter: (filter: ActiveFilterOption) => void
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

    // Estado para ordenação
    const [sortOption, setSortOption] = useState<SortOption | null>(null)

    // Estado para filtro de isActive
    const [activeFilter, setActiveFilter] = useState<ActiveFilterOption>("all")

    // useMemo é utilizado para evitar recalcular a lista filtrada sempre que o componente renderiza
    // garantindo melhor performance
    const filteredTranslators = useMemo(() => {
        // Criamos uma cópia da lista de autores para evitar modificar o estado original
        let result = [...optimisticTranslators]

        // Aplicar filtro por isActive
        if (activeFilter != "all") {
            const isActive = activeFilter === "active"
            result = result.filter((translator) => translator.isActive === isActive)
        }

        // Se houver um termo de pesquisa, filtramos os autores pelo nome ou biografia
        if (searchTerm !== "") {
            const lowerSearchTerm = searchTerm.toLowerCase()
            result = result.filter(
                (translator) =>
                    translator.name.toLowerCase().includes(lowerSearchTerm)
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
    }, [searchTerm, optimisticTranslators, sortOption, activeFilter])     // Dependências: recalcula apenas quando uma delas mudar

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

    // Resetar para a primeira página quando o sorting altera
    useEffect(() => {
        setCurrentPage(1)
    }, [sortOption, activeFilter])

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
                sortOption,
                setSortOption,
                activeFilter,
                setActiveFilter,
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
