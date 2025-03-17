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

    // Usar useMemo em vez de useEffect + useState para filtrar categorias
    const filteredPublishers = useMemo(() => {
        if (searchTerm === "") {
            return optimisticPublishers
        }

        return optimisticPublishers.filter((publisher) => publisher.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [searchTerm, optimisticPublishers])

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
