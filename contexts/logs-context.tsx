"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition } from "react"
import type { AuditLogWithRelations } from "@/lib/auditlogs"

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

    // Usar useMemo para filtrar logs
    const filteredAuditLogs = useMemo(() => {
        if (searchTerm === "") {
            return optimisticAuditLogs
        }

        return optimisticAuditLogs.filter((auditLog) => auditLog.entity.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [searchTerm, optimisticAuditLogs])

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

