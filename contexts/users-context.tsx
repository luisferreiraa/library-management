"use client"

import { useEffect, useState } from "react"

import { createContext, useContext, useMemo, type ReactNode, useOptimistic, useTransition } from "react"
import type { User } from "@/lib/users"

// Definir SortOption type
export type SortOption = {
    value: string
    direction: "asc" | "desc"
}

// Definir FilterOption type para isActive
export type ActiveFilterOption = "all" | "active" | "inactive"

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
    sortOption: SortOption | null
    setSortOption: (option: SortOption) => void
    activeFilter: ActiveFilterOption
    setActiveFilter: (filter: ActiveFilterOption) => void
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

    // Estado para ordenação
    const [sortOption, setSortOption] = useState<SortOption | null>(null)

    // Estado para filtro de isActive
    const [activeFilter, setActiveFilter] = useState<ActiveFilterOption>("all")

    // useMemo é utilizado para evitar recalcular a lista filtrada sempre que o componente renderiza
    // garantindo melhor performance
    const filteredUsers = useMemo(() => {
        // Criamos uma cópia da lista de autores para evitar modificar o estado original
        let result = [...optimisticUsers]

        // Aplicar filtro por isActive
        if (activeFilter != "all") {
            const isActive = activeFilter === "active"
            result = result.filter((borrowedBook) => borrowedBook.isActive === isActive)
        }

        // Se houver um termo de pesquisa, filtramos os autores pelo nome ou biografia
        if (searchTerm !== "") {
            const lowerSearchTerm = searchTerm.toLowerCase()
            result = result.filter(
                (user) =>
                    user.firstName.toLowerCase().includes(lowerSearchTerm) ||
                    user.lastName.toLocaleLowerCase().includes(lowerSearchTerm) ||
                    user.email.toLocaleLowerCase().includes(lowerSearchTerm) ||
                    user.username.toLocaleLowerCase().includes(lowerSearchTerm)
            )
        }

        // Se houver uma opção de ordenação selecionada, aplicamos a ordenação
        if (sortOption) {
            result.sort((a, b) => {
                let valueA: any, valueB: any

                switch (sortOption.value) {
                    case "username":
                        // Ordenação pelo username (string)
                        valueA = a.username
                        valueB = b.username
                        break
                    case "email":
                        // Ordenação pelo email (string)
                        valueA = a.email
                        valueB = b.email
                        break
                    case "createdAt":
                        // Ordenação pela data de criação (convertida para timestamp para comparação numérica)
                        valueA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                        valueB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                        break
                    default:
                        // Ordenação padrão pelo nome caso a opção não seja reconhecida
                        valueA = a.username
                        valueB = b.username
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
    }, [searchTerm, optimisticUsers, sortOption, activeFilter])     // Dependências: recalcula apenas quando uma delas mudar


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

    // Resetar para a primeira página quando o sorting altera
    useEffect(() => {
        setCurrentPage(1)
    }, [sortOption, activeFilter])

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
                sortOption,
                setSortOption,
                activeFilter,
                setActiveFilter,
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

