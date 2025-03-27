"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition, useEffect } from "react"
import type { PenaltyRule } from "@/lib/penaltyrules"

// Definir SortOption type
export type SortOption = {
    value: string
    direction: "asc" | "desc"
}

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
    currentPage: number
    setCurrentPage: (page: number) => void
    pageSize: number
    setPageSize: (size: number) => void
    paginatedRules: PenaltyRule[]
    totalPages: number
    sortOption: SortOption | null
    setSortOption: (option: SortOption) => void
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

    // Estado para paginação
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Estado para ordenação
    const [sortOption, setSortOption] = useState<SortOption | null>(null)

    // useMemo é utilizado para evitar recalcular a lista filtrada sempre que o componente renderiza
    // garantindo melhor performance
    const filteredPenaltyRules = useMemo(() => {
        // Criamos uma cópia da lista de autores para evitar modificar o estado original
        let result = [...optimisticPenaltyRules]

        // Se houver um termo de pesquisa, filtramos os autores pelo nome ou biografia
        if (searchTerm !== "") {
            const lowerSearchTerm = searchTerm.toLowerCase()
            result = result.filter(
                (penaltyRule) =>
                    penaltyRule.name.toLowerCase().includes(lowerSearchTerm)
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
    }, [searchTerm, optimisticPenaltyRules, sortOption])     // Dependências: recalcula apenas quando uma delas mudar

    // Calcular total de páginas
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredPenaltyRules.length / pageSize))
    }, [filteredPenaltyRules, pageSize])

    // Ajustar página atual se necessário
    useMemo(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(1, totalPages))
        }
    }, [totalPages, currentPage])

    // Obter penalty rules paginadas
    const paginatedRules = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return filteredPenaltyRules.slice(startIndex, startIndex + pageSize)
    }, [filteredPenaltyRules, currentPage, pageSize])

    // Resetar para a primeira página quando o sorting altera
    useEffect(() => {
        setCurrentPage(1)
    }, [sortOption])

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
                currentPage,
                setCurrentPage,
                pageSize,
                setPageSize,
                paginatedRules,
                totalPages,
                sortOption,
                setSortOption,
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
