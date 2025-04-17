"use client"

import createEntityContext from "./global-entity-context"
import type { Category } from "@/lib/categories"

const {
    Provider: CategoriesProvider,
    useEntityContext: useCategories,
} = createEntityContext<Category>()

export { CategoriesProvider, useCategories }