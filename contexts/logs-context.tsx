"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition, useEffect } from "react"
import type { AuditLogWithRelations } from "@/lib/auditlogs"

// Definir SortOption type
export type SortOption = {
    value: string
    direction: "asc" | "desc"
}

interface AuditLogsContextType {
    auditLogs: AuditLogWithRelations[]
    removeAuditLogs: (auditLogIds: string[]) => void
    isPending: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredAuditLogs: AuditLogWithRelations[]
    selectedAuditLogIds: string[]
    toggleAuditLogSelection: (auditLogId: string) => void
    toggleAllAuditLogs: (selected: boolean) => void
    clearSelection: () => void
    hasSelection: boolean
    currentPage: number
    setCurrentPage: (page: number) => void
    pageSize: number
    setPageSize: (size: number) => void
    paginatedLogs: AuditLogWithRelations[]
    totalPages: number
    sortOption: SortOption | null
    setSortOption: (option: SortOption) => void
}

const AuditLogsContext = createContext<AuditLogsContextType | undefined>(undefined)

export function AuditLogsProvider({
    children,
    initialAuditLogs,
}: {
    children: ReactNode
    initialAuditLogs: AuditLogWithRelations[]
}) {
    const [isPending, startTransition] = useTransition()
    const [optimisticAuditLogs, updateAuditLogs] = useOptimistic(
        initialAuditLogs,
        (state, action: { type: "remove"; auditLogIds: string[] }) => {
            if (action.type === "remove") {
                return state.filter((log) => !action.auditLogIds.includes(log.id))
            }
            return state
        }
    )

    // Estado para pesquisa
    const [searchTerm, setSearchTerm] = useState("")

    // Estado para seleção de Logs
    const [selectedAuditLogIds, setSelecteAuditLogIds] = useState<string[]>([])

    // Estado para paginação
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Estado para ordenação
    const [sortOption, setSortOption] = useState<SortOption | null>(null)

    // useMemo é utilizado para evitar recalcular a lista filtrada sempre que o componente renderiza
    // garantindo melhor performance
    const filteredAuditLogs = useMemo(() => {
        // Criamos uma cópia da lista de autores para evitar modificar o estado original
        let result = [...optimisticAuditLogs]

        // Se houver um termo de pesquisa, filtramos os autores pelo nome ou biografia
        if (searchTerm !== "") {
            const lowerSearchTerm = searchTerm.toLowerCase()
            result = result.filter(
                (auditLog) =>
                    auditLog.entity.toLowerCase().includes(lowerSearchTerm)
            )
        }

        // Se houver uma opção de ordenação selecionada, aplicamos a ordenação
        if (sortOption) {
            result.sort((a, b) => {
                let valueA: any, valueB: any

                switch (sortOption.value) {
                    case "entity":
                        // Ordenação pele entity (string)
                        valueA = a.entity
                        valueB = b.entity
                        break
                    case "timestamp":
                        // Ordenação pela data de criação (convertida para timestamp para comparação numérica)
                        valueA = a.timestamp ? new Date(a.timestamp).getTime() : 0
                        valueB = b.timestamp ? new Date(b.timestamp).getTime() : 0
                        break
                    default:
                        // Ordenação padrão pelo nome caso a opção não seja reconhecida
                        valueA = a.entity
                        valueB = b.entity
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
    }, [searchTerm, optimisticAuditLogs, sortOption])     // Dependências: recalcula apenas quando uma delas mudar

    // Calcular total de páginas
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredAuditLogs.length / pageSize))
    }, [filteredAuditLogs, pageSize])

    // Ajustar página atual se necessário
    useMemo(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(1, totalPages))
        }
    }, [totalPages, currentPage])

    // Obter logs paginados
    const paginatedLogs = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return filteredAuditLogs.slice(startIndex, startIndex + pageSize)
    }, [filteredAuditLogs, currentPage, pageSize])

    // Resetar para a primeira página quando o sorting altera
    useEffect(() => {
        setCurrentPage(1)
    }, [sortOption])

    const removeAuditLogs = (auditLogIds: string[]) => {
        startTransition(() => {
            updateAuditLogs({ type: "remove", auditLogIds })
            // Limpar seleção após remover
            setSelecteAuditLogIds((prev) => prev.filter((id) => !auditLogIds.includes(id)))
        })
    }

    const toggleAuditLogSelection = (auditLogId: string) => {
        setSelecteAuditLogIds((prev) =>
            prev.includes(auditLogId) ? prev.filter((id) => id !== auditLogId) : [...prev, auditLogId],
        )
    }

    const toggleAllAuditLogs = (selected: boolean) => {
        if (selected) {
            //Selecionar todos os logs filtrados
            setSelecteAuditLogIds(filteredAuditLogs.map((auditLog) => auditLog.id))
        } else {
            // Desmarcar todos
            setSelecteAuditLogIds([])
        }
    }

    const clearSelection = () => {
        setSelecteAuditLogIds([])
    }

    const hasSelection = selectedAuditLogIds.length > 0

    return (
        <AuditLogsContext.Provider
            value={{
                auditLogs: optimisticAuditLogs,
                removeAuditLogs,
                isPending,
                searchTerm,
                setSearchTerm,
                filteredAuditLogs,
                selectedAuditLogIds,
                toggleAuditLogSelection,
                toggleAllAuditLogs,
                clearSelection,
                hasSelection,
                currentPage,
                setCurrentPage,
                pageSize,
                setPageSize,
                paginatedLogs,
                totalPages,
                sortOption,
                setSortOption,
            }}
        >
            {children}
        </AuditLogsContext.Provider>
    )
}

export function useAuditLogs() {
    const context = useContext(AuditLogsContext)
    if (context === undefined) {
        throw new Error("useAuditLogs must be used within an AuditLogsProvider")
    }
    return context
}

