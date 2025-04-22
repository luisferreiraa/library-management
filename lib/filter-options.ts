import { ActiveFilterOption } from "@/types/types"
import { prisma } from "./prisma"

// Tipo para as opções de filtro
export type FilterOption<T extends string = string> = {
    value: T
    label: string
}

function createCommonFilterOptions<T extends string = string>(): FilterOption<T>[] {
    return [
        { value: "all" as T, label: "Todos" },
        { value: "active" as T, label: "Ativos" },
        { value: "inactive" as T, label: "Inativos" },
    ]
}

function createItemTypeFilterOptions<T extends string = string>(): FilterOption<T>[] {
    return [
        { value: "all" as T, label: "Todos" },
        { value: "BOOK" as T, label: "Livros" },
        { value: "PERIODICAL" as T, label: "Periódicos" },
        { value: "DVD" as T, label: "DVD" },
        { value: "VHS" as T, label: "VHS" },
        { value: "CD" as T, label: "CD" },
    ]
}

export async function getFilterOptions(
    entityType: "libraries"
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
        | "items"
): Promise<FilterOption<ActiveFilterOption>[]> {
    switch (entityType) {
        case "libraries":
        case "library-networks":
        case "roles":
        case "book-status":
        case "authors":
        case "categories":
        case "formats":
        case "languages":
        case "penalty-rules":
        case "publishers":
        case "translators":
        case "users":
        case "catalogs":
            return createCommonFilterOptions<ActiveFilterOption>()
        case "items":
            return createItemTypeFilterOptions<ActiveFilterOption>()

        default:
            return []
    }
}

export async function getCustomUserFilterOptions(): Promise<FilterOption<string>[]> {
    const commonOptions = createCommonFilterOptions<string>()

    const users = await prisma.user.findMany({
        select: { id: true, username: true },
    })

    return [
        ...commonOptions,
        ...users.map((user) => ({
            value: `user-${user.id}`,
            label: user.username,
        })),
    ]
}
