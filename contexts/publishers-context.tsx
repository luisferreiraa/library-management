"use client"

import { createContext, useContext, type ReactNode, useOptimistic, useTransition } from "react"
import type { Publisher } from "@/lib/publishers"

interface PublishersContextType {
    publishers: Publisher[]
    addPublisher: (publisher: Publisher) => void
    isPending: boolean
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
    const [optimisticPublishers, addOptimisticPublisher] = useOptimistic(initialPublishers, (state, newPublisher: Publisher) => [
        ...state,
        newPublisher,
    ])

    const addPublisher = (publisher: Publisher) => {
        startTransition(() => {
            addOptimisticPublisher(publisher)
        })
    }

    return (
        <PublishersContext.Provider
            value={{
                publishers: optimisticPublishers,
                addPublisher,
                isPending
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
