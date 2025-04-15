"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition, useEffect } from "react"
import type { Role } from "@/lib/roles"

// Definir SortOption type
export type SortOption<T = Role> = {
    value: keyof T
    direction: "asc" | "desc"
}

// Definir FilterOption type para isActive
export type ActiveFilterOption = "all" | "active" | "inactive"

interface RolesContextType {
    roles: Role[]
    addRole: (role: Role) => void
    removeRoles: (roleIds: string[]) => void
    isPending: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredRoles: Role[]
    selectedRoleIds: string[]
    toggleRoleSelection: (roleId: string) => void
    toggleAllRoles: (selected: boolean) => void
    clearSelection: () => void
    hasSelection: boolean
    currentPage: number
    setCurrentPage: (page: number) => void
    pageSize: number
    setPageSize: (size: number) => void
    paginatedRoles: Role[]
    totalPages: number
    sortOption: SortOption<Role> | null
    setSortOption: (option: SortOption<Role>) => void
    activeFilter: ActiveFilterOption
    setActiveFilter: (filter: ActiveFilterOption) => void
}

const RolesContext = createContext<RolesContextType | undefined>(undefined)

export function RolesProvider({
    children,
    initialRoles,
}: {
    children: ReactNode
    initialRoles: Role[]
}) {
    const [isPending, startTransition] = useTransition()
    const [optimisticRoles, updateRoles] = useOptimistic(
        initialRoles,
        (state, action: { type: "add"; role: Role } | { type: "remove"; roleIds: string[] }) => {
            if (action.type === "add") {
                return [...state, action.role]
            } else if (action.type === "remove") {
                return state.filter((role) => !action.roleIds.includes(role.id))
            }
            return state
        },
    )

    // Estado para pesquisa
    const [searchTerm, setSearchTerm] = useState("")

    // Estado para seleção de roles
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])

    // Estado para paginação
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Estado para ordenação
    const [sortOption, setSortOption] = useState<SortOption<Role> | null>(null)

    // Estado para filtro de isActive
    const [activeFilter, setActiveFilter] = useState<ActiveFilterOption>("all")

    // useMemo é utilizado para evitar recalcular a lista filtrada sempre que o componente renderiza
    // garantindo melhor performance
    const filteredRoles = useMemo(() => {
        // Criamos uma cópia da lista de autores para evitar modificar o estado original
        let result = [...optimisticRoles]

        // Aplicar filtro por isActive
        if (activeFilter != "all") {
            const isActive = activeFilter === "active"
            result = result.filter((borrowedbook) => borrowedbook.isActive === isActive)
        }

        // Se houver um termo de pesquisa, filtramos os autores pelo nome ou biografia
        if (searchTerm !== "") {
            const lowerSearchTerm = searchTerm.toLowerCase()
            result = result.filter(
                (role) =>
                    role.name.toLowerCase().includes(lowerSearchTerm)
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
    }, [searchTerm, optimisticRoles, sortOption, activeFilter])     // Dependências: recalcula apenas quando uma delas mudar

    // Calcular total de páginas
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredRoles.length / pageSize))
    }, [filteredRoles, pageSize])

    // Ajustar página atual se necessário
    useMemo(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(1, totalPages))
        }
    }, [totalPages, currentPage])

    // Obter roles paginados
    const paginatedRoles = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return filteredRoles.slice(startIndex, startIndex + pageSize)
    }, [filteredRoles, currentPage, pageSize])

    // Resetar para a primeira página quando o sorting altera
    useEffect(() => {
        setCurrentPage(1)
    }, [sortOption, activeFilter])

    const addRole = (role: Role) => {
        startTransition(() => {
            updateRoles({ type: "add", role })
        })
    }

    const removeRoles = (roleIds: string[]) => {
        startTransition(() => {
            updateRoles({ type: "remove", roleIds })
            // Limpar seleção após remover
            setSelectedRoleIds((prev) => prev.filter((id) => !roleIds.includes(id)))
        })
    }

    const toggleRoleSelection = (roleId: string) => {
        setSelectedRoleIds((prev) =>
            prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId],
        )
    }

    const toggleAllRoles = (selected: boolean) => {
        if (selected) {
            // Selecionar todos os roles filtradas
            setSelectedRoleIds(filteredRoles.map((role) => role.id))
        } else {
            // Desmarcar todas
            setSelectedRoleIds([])
        }
    }

    const clearSelection = () => {
        setSelectedRoleIds([])
    }

    const hasSelection = selectedRoleIds.length > 0

    return (
        <RolesContext.Provider
            value={{
                roles: optimisticRoles,
                addRole,
                removeRoles,
                isPending,
                searchTerm,
                setSearchTerm,
                filteredRoles,
                selectedRoleIds,
                toggleRoleSelection,
                toggleAllRoles,
                clearSelection,
                hasSelection,
                currentPage,
                setCurrentPage,
                pageSize,
                setPageSize,
                paginatedRoles,
                totalPages,
                sortOption,
                setSortOption,
                activeFilter,
                setActiveFilter,
            }}
        >
            {children}
        </RolesContext.Provider>
    )
}

export function useRoles() {
    const context = useContext(RolesContext)
    if (context === undefined) {
        throw new Error("useRoles must be used within a RolesProvider")
    }
    return context
}
