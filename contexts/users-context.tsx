"use client"

import { useState } from "react"

import { createContext, useContext, useMemo, type ReactNode, useOptimistic, useTransition } from "react"
import type { User } from "@/lib/users"

interface UsersContextType {
    users: User[]
    addUser: (user: User) => void
    removeUsers: (userIds: string[]) => void
    isPending: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredUsers: User[]
    selectedUserIds: string[]
    toggleUserSelection: (userId: string) => void
    toggleAllUsers: (selected: boolean) => void
    clearSelection: () => void
    hasSelection: boolean
    currentPage: number
    setCurrentPage: (page: number) => void
    pageSize: number
    setPageSize: (size: number) => void
    paginatedUsers: User[]
    totalPages: number
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

export function UsersProvider({
    children,
    initialUsers,
}: {
    children: ReactNode
    initialUsers: User[]
}) {
    const [isPending, startTransition] = useTransition()
    const [optimisticUsers, updateUsers] = useOptimistic(
        initialUsers,
        (state, action: { type: "add"; user: User } | { type: "remove"; userIds: string[] }) => {
            if (action.type === "add") {
                return [...state, action.user]
            } else if (action.type === "remove") {
                return state.filter((user) => !action.userIds.includes(user.id))
            }
            return state
        },
    )

    // Estado para pesquisa
    const [searchTerm, setSearchTerm] = useState("")

    // Estado para seleção de usuários
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])

    // Estado para paginação
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Use useMemo para filtrar usuários
    const filteredUsers = useMemo(() => {
        if (searchTerm === "") {
            return optimisticUsers
        }

        const lowerSearchTerm = searchTerm.toLowerCase()
        return optimisticUsers.filter(
            (user) =>
                user.firstName.toLowerCase().includes(lowerSearchTerm) ||
                user.lastName.toLowerCase().includes(lowerSearchTerm) ||
                user.email.toLowerCase().includes(lowerSearchTerm) ||
                user.username.toLowerCase().includes(lowerSearchTerm),
        )
    }, [searchTerm, optimisticUsers])

    // Calcular total de páginas
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredUsers.length / pageSize))
    }, [filteredUsers, pageSize])

    // Ajustar página atual se necessário
    useMemo(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(1, totalPages))
        }
    }, [totalPages, currentPage])

    // Obter autores paginados
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return filteredUsers.slice(startIndex, startIndex + pageSize)
    }, [filteredUsers, currentPage, pageSize])

    const addUser = (user: User) => {
        startTransition(() => {
            updateUsers({ type: "add", user })
        })
    }

    const removeUsers = (userIds: string[]) => {
        startTransition(() => {
            updateUsers({ type: "remove", userIds })
            // Limpar seleção após remover
            setSelectedUserIds((prev) => prev.filter((id) => !userIds.includes(id)))
        })
    }

    const toggleUserSelection = (userId: string) => {
        setSelectedUserIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
    }

    const toggleAllUsers = (selected: boolean) => {
        if (selected) {
            // Selecionar todos os usuários filtrados
            setSelectedUserIds(filteredUsers.map((user) => user.id))
        } else {
            // Desmarcar todos
            setSelectedUserIds([])
        }
    }

    const clearSelection = () => {
        setSelectedUserIds([])
    }

    const hasSelection = selectedUserIds.length > 0

    return (
        <UsersContext.Provider
            value={{
                users: optimisticUsers,
                addUser,
                removeUsers,
                isPending,
                searchTerm,
                setSearchTerm,
                filteredUsers,
                selectedUserIds,
                toggleUserSelection,
                toggleAllUsers,
                clearSelection,
                hasSelection,
                currentPage,
                setCurrentPage,
                pageSize,
                setPageSize,
                paginatedUsers,
                totalPages,
            }}
        >
            {children}
        </UsersContext.Provider>
    )
}

export function useUsers() {
    const context = useContext(UsersContext)
    if (context === undefined) {
        throw new Error("useUsers must be used within a UsersProvider")
    }
    return context
}

