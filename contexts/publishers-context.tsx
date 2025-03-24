"use client"

import { createContext, useContext, useState, useMemo, type ReactNode, useOptimistic, useTransition } from "react"
import type { Publisher } from "@/lib/publishers"

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

    // Usar useMemo em vez de useEffect + useState para filtrar categorias
    const filteredPublishers = useMemo(() => {
        if (searchTerm === "") {
            return optimisticPublishers
        }

        return optimisticPublishers.filter((publisher) => publisher.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [searchTerm, optimisticPublishers])

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
