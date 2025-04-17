"use client"

import {
    createContext,
    useContext,
    useState,
    useMemo,
    type ReactNode,
    useOptimistic,
    useTransition,
    useEffect,
} from "react"
import type { SortOption, ActiveFilterOption } from "../types/types"
import { FilterOption, getFilterOptions } from "@/lib/filter-options"

type EntityType =
    | "libraries"
    | "library-networks"
    | "roles"
    | "book-status"
    | "authors"
    | "categories"
    | "formats"
    | "languages"
    | "penalty-rules"
    | "publishers"
    | "translators"
    | "users"
    | "catalogs"

interface EntityContextType<T> {
    entities: T[]
    addEntity: (entity: T) => void
    removeEntities: (ids: string[]) => void
    isPending: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredEntities: T[]
    selectedEntityIds: string[]
    toggleEntitySelection: (id: string) => void
    toggleAllEntities: (selected: boolean) => void
    clearSelection: () => void
    hasSelection: boolean
    currentPage: number
    setCurrentPage: (page: number) => void
    pageSize: number
    setPageSize: (size: number) => void
    paginatedEntities: T[]
    totalPages: number
    sortOption: SortOption<T> | null
    setSortOption: (option: SortOption<T>) => void
    activeFilter: ActiveFilterOption
    setActiveFilter: (filter: ActiveFilterOption) => void
    filterOptions: FilterOption<ActiveFilterOption>[]
    setFilterOptions: (options: FilterOption<ActiveFilterOption>[]) => void
}

const createEntityContext = <T extends { id: string; name: string; isActive?: boolean }>() => {
    const Context = createContext<EntityContextType<T> | undefined>(undefined)

    const Provider = ({
        children,
        initialEntities,
        entityType,
    }: {
        children: ReactNode
        initialEntities: T[]
        entityType: EntityType
    }) => {
        const [isPending, startTransition] = useTransition()
        interface Action<T> {
            type: "add" | "remove"
            entity?: T
            entityIds?: string[]
        }

        const [optimisticEntities, updateEntities] = useOptimistic(initialEntities, (state, action: Action<T>) => {
            if (action.type === "add" && action.entity) {
                return [...state, action.entity]
            } else if (action.type === "remove" && action.entityIds) {
                return (action.entityIds ?? []).length > 0 ? state.filter((e) => !action.entityIds!.includes(e.id)) : state
            }
            return state
        })

        const [searchTerm, setSearchTerm] = useState("")
        const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>([])
        const [currentPage, setCurrentPage] = useState(1)
        const [pageSize, setPageSize] = useState(10)
        const [sortOption, setSortOption] = useState<SortOption<T> | null>(null)
        const [activeFilter, setActiveFilter] = useState<ActiveFilterOption>("all")
        const [filterOptions, setFilterOptions] = useState<FilterOption<ActiveFilterOption>[]>([])

        useEffect(() => {
            async function fetchFilterOptions() {
                const options = await getFilterOptions(entityType)
                setFilterOptions(options)
            }

            fetchFilterOptions()
        }, [entityType])

        const filteredEntities = useMemo(() => {
            let result = [...optimisticEntities]

            if (activeFilter !== "all") {
                const isActive = activeFilter === "active"
                result = result.filter((e) => e.isActive === isActive)
            }

            if (searchTerm !== "") {
                const term = searchTerm.toLowerCase()
                result = result.filter((e) => e.name.toLowerCase().includes(term))
            }

            if (sortOption) {
                result.sort((a, b) => {
                    const valA = a[sortOption.value]
                    const valB = b[sortOption.value]

                    if (typeof valA === "string" && typeof valB === "string") {
                        return sortOption.direction === "asc"
                            ? valA.localeCompare(valB)
                            : valB.localeCompare(valA)
                    }

                    return sortOption.direction === "asc" ? (valA as number) - (valB as number) : (valB as number) - (valA as number)
                })
            }

            return result
        }, [searchTerm, optimisticEntities, sortOption, activeFilter])

        const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredEntities.length / pageSize)), [
            filteredEntities,
            pageSize,
        ])

        useMemo(() => {
            if (currentPage > totalPages) {
                setCurrentPage(Math.max(1, totalPages))
            }
        }, [totalPages, currentPage])

        const paginatedEntities = useMemo(() => {
            const start = (currentPage - 1) * pageSize
            return filteredEntities.slice(start, start + pageSize)
        }, [filteredEntities, currentPage, pageSize])

        useEffect(() => {
            setCurrentPage(1)
        }, [sortOption, activeFilter])

        const addEntity = (entity: T) => {
            startTransition(() => {
                updateEntities({ type: "add", entity })
            })
        }

        const removeEntities = (entityIds: string[]) => {
            startTransition(() => {
                updateEntities({ type: "remove", entityIds })
                setSelectedEntityIds((prev) => prev.filter((id) => !entityIds.includes(id)))
            })
        }

        const toggleEntitySelection = (id: string) => {
            setSelectedEntityIds((prev) =>
                prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
            )
        }

        const toggleAllEntities = (selected: boolean) => {
            if (selected) {
                setSelectedEntityIds(filteredEntities.map((e) => e.id))
            } else {
                setSelectedEntityIds([])
            }
        }

        const clearSelection = () => setSelectedEntityIds([])

        const hasSelection = selectedEntityIds.length > 0

        return (
            <Context.Provider
                value={{
                    entities: optimisticEntities,
                    addEntity,
                    removeEntities,
                    isPending,
                    searchTerm,
                    setSearchTerm,
                    filteredEntities,
                    selectedEntityIds,
                    toggleEntitySelection,
                    toggleAllEntities,
                    clearSelection,
                    hasSelection,
                    currentPage,
                    setCurrentPage,
                    pageSize,
                    setPageSize,
                    paginatedEntities,
                    totalPages,
                    sortOption,
                    setSortOption,
                    activeFilter,
                    setActiveFilter,
                    filterOptions,
                    setFilterOptions,
                }}
            >
                {children}
            </Context.Provider>
        )
    }

    const useEntityContext = () => {
        const context = useContext(Context)
        if (!context) throw new Error("useEntityContext must be used within its Provider")
        return context
    }

    return {
        Provider,
        useEntityContext,
    }
}

export default createEntityContext
