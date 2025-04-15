"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition, useEffect } from "react"
import type { Publisher } from "@/lib/publishers"

// Definir SortOption type
export type SortOption<T = Publisher> = {
    value: keyof T
    direction: "asc" | "desc"
}

// Definir FilterOption type para isActive
export type ActiveFilterOption = "all" | "active" | "inactive"

interface PublishersContextType {
    publishers: Publisher[]
    addPublisher: (publisher: Publisher) => void
    removePublishers: (publisherIds: string[]) => void
    isPending: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredPublishers: Publisher[]
    selectedPublisherIds: string[]
    togglePublisherSelection: (publisherId: string) => void
    toggleAllPublishers: (selected: boolean) => void
    clearSelection: () => void
    hasSelection: boolean
    currentPage: number
    setCurrentPage: (page: number) => void
    pageSize: number
    setPageSize: (size: number) => void
    paginatedPublishers: Publisher[]
    totalPages: number
    sortOption: SortOption<Publisher> | null
    setSortOption: (option: SortOption<Publisher>) => void
    activeFilter: ActiveFilterOption
    setActiveFilter: (filter: ActiveFilterOption) => void
}

const PublishersContext = createContext<PublishersContextType | undefined>(undefined)

export function PublishersProvider({
    children,
    initialPublishers,
}: {
    children: ReactNode
    initialPublishers: Publisher[]
}) {
    const [isPending, startTransition] = useTransition()
    const [optimisticPublishers, updatePublishers] = useOptimistic(
        initialPublishers,
        (state, action: { type: "add"; publisher: Publisher } | { type: "remove"; publisherIds: string[] }) => {
            if (action.type === "add") {
                return [...state, action.publisher]
            } else if (action.type === "remove") {
                return state.filter((publisher) => !action.publisherIds.includes(publisher.id))
            }
            return state
        },
    )

    // Estado para pesquisa
    const [searchTerm, setSearchTerm] = useState("")

    // Estado para seleção de categorias
    const [selectedPublisherIds, setSelectedPublisherIds] = useState<string[]>([])

    // Estado para paginação
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Estado para ordenação
    const [sortOption, setSortOption] = useState<SortOption<Publisher> | null>(null)

    // Estado para filtro de isActive
    const [activeFilter, setActiveFilter] = useState<ActiveFilterOption>("all")

    // useMemo é utilizado para evitar recalcular a lista filtrada sempre que o componente renderiza
    // garantindo melhor performance
    const filteredPublishers = useMemo(() => {
        // Criamos uma cópia da lista de autores para evitar modificar o estado original
        let result = [...optimisticPublishers]

        // Aplicar filtro por isActive
        if (activeFilter != "all") {
            const isActive = activeFilter === "active"
            result = result.filter((publisher) => publisher.isActive === isActive)
        }

        // Se houver um termo de pesquisa, filtramos os autores pelo nome ou biografia
        if (searchTerm !== "") {
            const lowerSearchTerm = searchTerm.toLowerCase()
            result = result.filter(
                (publisher) =>
                    publisher.name.toLowerCase().includes(lowerSearchTerm)
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
    }, [searchTerm, optimisticPublishers, sortOption, activeFilter])     // Dependências: recalcula apenas quando uma delas mudar

    // Calcular total de páginas
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredPublishers.length / pageSize))
    }, [filteredPublishers, pageSize])

    // Ajustar página atual se necessário
    useMemo(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(1, totalPages))
        }
    }, [totalPages, currentPage])

    // Obter editoras paginadas
    const paginatedPublishers = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return filteredPublishers.slice(startIndex, startIndex + pageSize)
    }, [filteredPublishers, currentPage, pageSize])

    // Resetar para a primeira página quando o sorting altera
    useEffect(() => {
        setCurrentPage(1)
    }, [sortOption, activeFilter])

    const addPublisher = (publisher: Publisher) => {
        startTransition(() => {
            updatePublishers({ type: "add", publisher })
        })
    }

    const removePublishers = (publisherIds: string[]) => {
        startTransition(() => {
            updatePublishers({ type: "remove", publisherIds })
            // Limpar seleção após remover
            setSelectedPublisherIds((prev) => prev.filter((id) => !publisherIds.includes(id)))
        })
    }

    const togglePublisherSelection = (publisherId: string) => {
        setSelectedPublisherIds((prev) =>
            prev.includes(publisherId) ? prev.filter((id) => id !== publisherId) : [...prev, publisherId],
        )
    }

    const toggleAllPublishers = (selected: boolean) => {
        if (selected) {
            // Selecionar todas as editoras filtradas
            setSelectedPublisherIds(filteredPublishers.map((publisher) => publisher.id))
        } else {
            // Desmarcar todas
            setSelectedPublisherIds([])
        }
    }

    const clearSelection = () => {
        setSelectedPublisherIds([])
    }

    const hasSelection = selectedPublisherIds.length > 0

    return (
        <PublishersContext.Provider
            value={{
                publishers: optimisticPublishers,
                addPublisher,
                removePublishers,
                isPending,
                searchTerm,
                setSearchTerm,
                filteredPublishers,
                selectedPublisherIds,
                togglePublisherSelection,
                toggleAllPublishers,
                clearSelection,
                hasSelection,
                currentPage,
                setCurrentPage,
                pageSize,
                setPageSize,
                paginatedPublishers,
                totalPages,
                sortOption,
                setSortOption,
                activeFilter,
                setActiveFilter,
            }}
        >
            {children}
        </PublishersContext.Provider>
    )
}

export function usePublishers() {
    const context = useContext(PublishersContext)
    if (context === undefined) {
        throw new Error("usePublishers must be used within a PublishersProvider")
    }
    return context
}
