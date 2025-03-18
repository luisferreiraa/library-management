"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition } from "react"
import type { Role } from "@/lib/roles"

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

    // Usar useMemo em vez de useEffect + useState para filtrar roles
    const filteredRoles = useMemo(() => {
        if (searchTerm === "") {
            return optimisticRoles
        }

        return optimisticRoles.filter((role) => role.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [searchTerm, optimisticRoles])

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
